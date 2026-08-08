---
title: Model Quantization | Primer
date: 2026-03-17 13:48:49
categories:
  - Model Quantization
tags: model-quant
mathjax: true
---

References:

- [Model Quantization: Concepts, Methods, and Why It Matters](https://developer.nvidia.com/blog/model-quantization-concepts-methods-and-why-it-matters/)

## Introduction

The goal of quantization a model is apparent, just for deploying a large model in a resource-constrained environment which maintaining approximate high performances. To this end, quantization infrastructures are designed. For example, the commonly used data types includes `BF16,FP16,FP8` and `NVFP4` for floating numbers. They differ from the the number of bits to represent sign, exponent and mantissa (or significand).

- `BF16`: 1 bit for sign, 8 bits for exponent and 7 bits for mantissa. Share an approximate same value range with `FP32` by sacrificing the precision. Number range `-3.39e-38` to `3.39e38`.
- `FP16`: 1 bit for sign, 5 bits for exponent and 10 bits for mantissa. More precise than `BF16` by sacrificing the representation range. Number range `-65504` to `65504`.
- `FP8`: Two types of `FP8` are commonly used, one is `E4M3` and the other is `E5M2`.
- `NVFP4`: Only 1 bit for mantissa and 2 bits for exponent, additional scaling factors are used for different blocks of tensors to extend the representation range.

In total, the representation range can be calculated via (normalized):
$$
\begin{equation}
    x = (-1)^{s} \times 2^{e - z} \times (1 + \sum_{i=1}^b m_i 2^{-i}), \label{eq:norm_range}
\end{equation}
$$

where $s$ stands for sign, $e$ is the exponent value, $z$ is the bias for exponent, $m_i$ is the binary of $i$-th mantissa, $b$ is the total number of bits for mantissa.

---

- Normalized/Standard number range: the mantissa will add $1$, forming a value like $1.M$. The minimum value of exponent $e$ is $1$. For example, for `BF16`, the maximum value is $x = (-1)^0 \times 2^{254 - 127} \times (1 + \sum_{i=1}^7 2^{-i}) \approx 2^{127} \times 1.9922 \approx 10^{38}$. And the minimum value is $x = (-1)^{1} \times 2^{1 - 127} \times (1 + 0) \approx -2^{-126} \approx -10^{38}$.
- Denormalized number range: when the exponent is $0$, the mantissa will add $0$ but the exponent keeps to be $1$. Take `BF16` as example, the values around zero are $x = (-1)^{1} \times 2^{1 - 127} \times (0 + \sum_{i=1}^7 2^{-i})$ to force the values approach the zero slowly.
- Zero: When both $e=0$ and $m=0$, the number is exactly $0$.
- NaN/Inf: $e=255$ (in `BF16`) is a specitial value for NaN/Inf.

---

Quantization are tipically used in three scenes: the model weight quantization, the activation quantization and quantization on KV cache for decoder-only transformers.

## Quantization Algorithms

Quantization maps a float number $x \in [\alpha, \beta]$ to a low-precision value $x_q \in [\alpha_q, \beta_q]$.

**Affine/Asymmetric Quantization**: Defined by scale factor $s$ and the zero-point $z$. Scale factor defines the step size of the quantizer. And the zero-point is the same type with $x_q$, mapping the real value zero *exactly* during quantization. The quantization process can written as:
$$
\begin{equation}
    x_q = \text{clip}(\text{round}(\frac{x}{s} + z), \alpha_q, \beta_q),
\end{equation}
$$

where:

- `round` converts the scaled value to the nearest quantized representation.
- `clip` ensures the scaled value stay within the range of quantized representation.

To *recover* the full-precision from a quantized value:
$$
\begin{equation}
    x \approx x^{\prime} = s \cdot (x_q - z). \label{eq:affine_quant}
\end{equation}
$$

As we can see that `round` and `clip` bring errors naturally, which are inherent to the quantization process.

**Symmetric Quantization**: Fixing the zero-point $z=0$, symmetric quantization reduces additional computation overhead by eliminating the addition operators. The process of quantization and de-quantization can be written as:
$$
\begin{align}
    x_q &= \text{clip}(\text{round}(\frac{x}{s}), \alpha_q, \beta_q) \label{eq:symmetric_quant} \\
    x &\approx x^{\prime} = s \cdot x_q
\end{align}
$$
> NOTE: The mostly used quantization algrithm is symmetric quantization as the affine quantization does not offer a significant boost on model performances. NVIDIA TensorRT and Model Optimizer use symmetric quantization.

**AbsMax algorithm**: A widely used algorithm to calculate scale factor $s$ is `AbsMax` due to its simplicity and effectiveness. For symmetric quantization, it can be written as:
$$
\begin{equation}
    s = \frac{\max(|x_{max}|, |x_{min}|) \cdot 2}{\beta_q - \alpha_q} \label{eq:absmax}
\end{equation}
$$

For affine quantization:
$$
\begin{align}
    s &= \frac{x_{max} - x_{min}}{\beta_q - \alpha_q} \\
    z &= \text{round}(\alpha_q - \frac{x_{min}}{s})
\end{align}
$$

**Other Advanced algorithms**: The main goal of quantization algorithms is to find a balance between the computational overhead and the model performances, and some advanced algorithms are designed to reduce the errors brought by quantization process.

- [Activation-aware Weight Quantization (AWQ)](https://arxiv.org/abs/2306.00978)
- [Generative Pre-trained Transformer Quantization (GPTQ)](https://arxiv.org/abs/2210.17323)
- [SmoothQuant](https://arxiv.org/abs/2211.10438)


## Quantization Granularity

To define which elements of a tensor share the same quantization parameters, the quantization process can be conducted on different granularities. That is, we use which elements of a tensor to get our $x_{max}$ and $x_{min}$.

- **Per-Tensor/Per-Layer**: All values of a tensor share the same quantization parameters, which is the simplest and most memory-efficient approach, but leading to higher quantization errors especially when the data distribution varies across dimension.
- **Per-Channel**: Different set of quantization parameters are shared inner the same channel. This method reduces quantization errors by isolating outlier values to their own dimensions, rather than affecting entire values.
- **Per-Block/Per-Group**: This method divides a tensor into smaller blocks and each has its own set of quantization parameters, which is useful when different regions of the tensor have varying distributions.

## Quantization Approaches

In most cases, quantizing the pre-trained model weights is straight forward as they are static values and input data independent. However, quantizing the activation values is more troublesome for their dependency of input values and important ouliers, which will significantly affect the quantization scaling factor.

**Post-Training Quantization (PTQ)**: During PTQ, we add *observers* to activation we want to quantize and inference the model with representative calibration dataset. The observers return the activation values and we use the same quantization algrithms to determine a scaling factor.

- <u>Weight-only quantization</u>: Given a pre-trained model, the model weights are static and data independent. As the weights are fixed, no additional data is required. We just calculate the scaling factor with/without the zero-point and map the weights to low-precision values.
- <u>Weight and Activation quantization</u>: We use representative data for both weight and activation quantization as the activation values are calculated runtime. The process of collecting statistics of activation values and determine suitable scale factor and zero-point is called *calibration*. During calibration, the model weights are frozen, and the input representative data is used to calculate quantization parameters.
  - Static quantization: Input all calibration data at once and calculate the scale factor and zero-point. And then, these parameters are static after deploying the model.
  - Dynamic quantization: No calibration data is required, calculate the scale factor and zero-point at runtime, which are vary for each input data.

**Quantization Aware Training (QAT)**: Designed to offset the accuracy degradation accompanied the quantization process, a quantization aware module is integrated into the model during training to conduct a fake-quantization. To be specific, the fake quantization module mimics the quantized model behaviour with quantization followed by a de-quantization step to introduce the quantization errors explicitly during training. As the model parameters are optimized conditioned on quantization errors, it remains high-performance even after quantization.

> NOTE: The non-differentiability problem raises from QAT as the quantization function such as `round` is not differentiable. QAT uses [straight through estimator (STE)](https://arxiv.org/abs/1308.3432) to approximate the gradients for these functions as identity during backpropogation.
