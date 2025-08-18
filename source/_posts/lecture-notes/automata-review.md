---
title: Lecture Notes | Formal Language and Automata
date: 2025-05-28 10:46:43
tags: lecture-notes
mathjax: true
published: false
---

## 形式语言与自动机大纲

- 语言、文法、自动机的基本概念
- 有穷自动机
- 正则语言、正则表达式、正则文法
- 正则语言的性质
- 上下文无关语言
- 下推自动机
- 上下文无关语言的性质
- 线性有界自动机与上下文有关文法
- 图灵机与短语结构文法
- 计算理论相关概念

### 语言、文法、自动机的基本概念

（乔姆斯基定义）语言 $L \subset \Sigma^*$，即字母表 $\Sigma$ 字母组成的串的集合，在字母表上按照一定规则定义文法，文法能产生的所有句子的集合就是该文法产生的语言。
（克林定义）按照一定规则定义自动机，该自动机就定义了一个语言，语言由该自动机能识别的所有句子组成。

> 三者之间的关系：文法是定义语言的数学模型，自动机是语言的识别系统。一个文法产生的语言可以构造相应的自动机识别，一个自动机识别的语言可以构造文法产生该语言。一定类型的自动机和一定类型的文法具有等价性

| 语言                           | 文法           | 自动机         |
| ------------------------------ | -------------- | -------------- |
| 正则语言                       | 正则文法       | 有穷自动机     |
| 上下文无关语言                 | 上下文无关文法 | 下推自动机     |
| 上下文相关语言                 | 上下文相关文法 | 线性有界自动机 |
| 短语结构语言（递归可枚举语言） | 短语结构文法   | 图灵机         |

*从下到上依次包含关系*。

**字母表的运算**

- 字母表的乘积： $\Sigma_1 \Sigma_2 = \{ ab | a \in \Sigma_1, b \in \Sigma_2 \}$
- 字母表的幂： $\Sigma^0 = \{ \epsilon \}, \Sigma^{n} = \Sigma^{n-1} \Sigma$
- 字母表的正闭包： $\Sigma^{+} = \Sigma \cup \Sigma^{2} \cup \Sigma^{3} \cup \cdots$
- 字母表的克林闭包： $\Sigma^{*} = \Sigma^0 \cup \Sigma^{+}$

**句子**： $x \in \Sigma^{*}$ or $x \in L$ or $w \in L(G)$
**语言**： $L \subset \Sigma^{*}$ or $L(G) = \{ w | w \in T^{*}, S \Rightarrow^{*} w \}$

**语言的运算**

- 语言的乘积： $L_1 L_2 = \{ xy | x \in L_1, y \in L_2 \}$，是字母表 $\Sigma_1 \cup \Sigma_2$ 上的语言
- 语言的幂： $L^0 = \{ \epsilon \}, L^n = L^{n-1} L$
- 语言的正闭包： $L^{+} = L \cup L^2 \cup \cdots$
- 语言的克林闭包： $L^{*} = L^0 \cup L \cup L^2 \cup \cdots$

**文法**：可以描述语言的结构特征，可以产生这个语言的所有句子。四元组： $G = ( V, T, P, S )$ where 

1. $V$ is the non-empty finite set of variables, for $\forall A \in V$, $A$ is the variable, or nonterminal
2. $T$ is the non-empty finite set of terminal, for $\forall a \in T$, $a$ is the terminal. We have $V \cap T = \Phi$
3. $S$ is the start symbol of $G$
4. $P$ is the non-empty finite set of productions. The elements in $P$ have the form $\alpha \rightarrow \beta$, where $\alpha \in (V \cup T)^{+}$ and contains at least one symbol in $V$, $\beta \in (V \cup T)^{*}$
5. $\alpha \Rightarrow_G^n \beta$ means $\alpha$ induces $\beta$ on $G$ with $n$ steps

**句型**：$\alpha$ is the sentence form if $G = (V, T, P, S), \forall \alpha \in (V \cup T)^{*}, S \Rightarrow^{*} \alpha$

> 证明某个语言是由某个文法产生必须
> 
> 1. 语言每个句子都可以由文法开始符号推导出来
> 2. 文法开始符号推导出来的每个句子都是语言中的句子

```sh
# Construct the grammar G of language L(G) = {w w^T | w in {0,1,2,3}^{+}}
# Recursively contructs G:
# 1. 00 | 11 | 22 | 33 \in L
# 2. for x in L, if a in {0,1,2,3}, then axa in L
# 3. all sentences in L satisfy 1. 2.
G: S -> 00 | 11 | 22 | 33
   S -> 0S0 | 1S1 | 2S2 | 3S3
```

```sh
# Construct the grammar of L(G) = {a^n b^n c^n | n >= 1}
# Consider L'(G) = {a^n (bc)^n | n >= 1}, we only need to 
# switch the position of bc
G: S -> aBC | aSBC
   CB -> BC
   aB -> ab
   bB -> bb
   bC -> bc
   cC -> cc
```

**Exersize**

```sh
设字母表为 {0,1}

1. 以0开头，1结尾
G: S -> 0 S 1 | 0 1

2. 长度为奇数的串
# 奇数串为偶数串+1，偶数串为奇数串+1
G: S -> E 0 | E 1
   E -> S 0 | S 1 | eps

3. 连续三个0的串
G: S -> A 000 B
   A -> 0 A | 1 A | eps
   B -> 0 B | 1 B | eps

4. 正数第7个位置是0的串
G: S -> A 0 B
   A -> X X X X X X
   X -> 0 | 1
   B -> 0 B | 1 B | eps

设字母表为 {a,b,c}

1. {a^n b^n | n >= 0}
G: S -> a S b | eps

2. {a^n b^m | n,m >= 1}
G: S -> A ab B
   A -> a A | eps
   B -> b B | eps

3. {a^n b^n a^n | n >= 1}
G: S -> a B A | aba
   AB -> BA
   aB -> ab
   bB -> bb
   bA -> ba
   aA -> aa

4. {awa | w in {a,b,c}^+}
G: S -> a B a
   B -> a B | b B | c B | a | b | c

5. {x w x^T | x,w in {a,b,c}^+}
G: S -> a A a | b A b | c A c
   A -> S | a A | b A | c A | a | b | c

6. {w | w = w^T, w in {a,b,c}^+}
G: S -> a | b | c | a A a | b A b | c A c
   A -> S | eps
```

**自动机**：包含读头、输入带、状态转换、存储单元和输出装置。是符号串集合的识别系统。

### 有穷自动机 FA

FA 是一个五元组 $M = (Q, \Sigma, \delta, q_0, F)$

- $Q$ 是状态的非空有穷集合
- $\Sigma$ 输入字母表
- $q_0$ 开始状态
- $\delta: Q \times \Sigma \rightarrow Q$ or $\delta(q,a)=p$ 状态转移函数，在 $q$ 状态读入字符 $a$ 进入到下一个状态 $p$ 且读头指向下一个字符
- $F$ 终止状态集合

将状态转移函数进行扩充： $\hat{\delta}: Q \times \Sigma^* \rightarrow Q$ 并定义 $\hat{\delta}(q,\epsilon)=q, \hat{\delta}(q,wa)=\delta(\hat{\delta}(q,w), a)$

若 $\forall x \in \Sigma^*, \delta(q_0,x)\in F$ 则串被自动机接受，否则不接受。 $L(M)=\{ x | x\in \Sigma^* \wedge \delta(q_0,x)\in F \}$ 称为被自动机识别等语言。若语言相等，则识别二者的自动等价

**即时描述**： $x,y\in \Sigma^*, \delta(q_0,x)=q, xqy$ 称为自动机的一个即时描述，表示 $xy$ 是自动机正在处理的字符串， $x$ 引导自动机从 $q_0$ 启动并到达状态 $q$，而自动机当前正注视着 $y$ 的首字符。如果 $xqay$ 是自动机的一个即时描述，且 $\delta(q,a)=p$，则 $xqay \vdash xapy$

**确定状态的有穷自动机 DFA**：$q\in Q, a\in \Sigma, \delta(q,a)$ 均有确定的值

**不确定状态的有穷自动机 NFA**： $\delta: Q \times \Sigma \rightarrow 2^Q$ 表示一个状态读入一个符号后有多个动作可以选择

- DFA 与 NFA 等价：将 NFA 转化为 DFA，先将 NFA 的初始状态看作单独闭包，再在现有的状态闭包中根据产生式读入符号，每读入一个符号可能会到达多个状态，将这些状态的集合作为 DFA 的一个状态，包含 NFA 终止状态的状态集合就是 DFA 的终止状态

**带有空移动的有穷自动机 $\epsilon$-NFA**： $\delta: Q \times \Sigma \cup \{ \epsilon \}$ 表示到达某个状态后可以在不接受任何新字符的情况下进行状态转移

- $\epsilon$-NFA 与 NFA 等价：将前者转化为后者，先找到前者的可以进行空移动的状态转移函数，二者的状态转移函数相同，再确定 NFA 的终止状态，如果 $\epsilon$-NFA 的初始状态的空闭包与其终止状态有交集，则在 NFA 中应该将初始状态添加到终止状态集合中

### 正则语言与正则文法

**正则表达式 RE**：

1.  $\Phi$ 是 $\Sigma$ 上的 RE，它表示语言 $\Phi$
2.  $\epsilon$ 是字母表上的 RE，表示语言 $\{ \epsilon \}$
3.  对于字母表中的任意字符都是字母表上的 RE，表示语言为该单个符号构成的集合
4.  正则表达式的和（语言的并）、乘积（语言的连接）、闭包（语言的闭包）都是正则表达式

**定理**： RE 与 FA 等价，因此可以使用图上作业法将 FA 转化为 RE，也可以通过小的正则表达式对应的 FA 将较大的正则表达式化为 FA

**定理**： RL 可以由 RE 表示

**正则文法**：如果对于 $\forall \alpha \rightarrow \beta \in P$ 都有形式 $A \rightarrow w, A \rightarrow w B$，其中 $A, B\in V, w \in T^+$，则称该文法为正则文法，由该文法产生的语言为正则语言

**定理**：一个语言为正则语言的充要条件是，存在一个产生该语言的文法，它的产生式满足上述两种形式

**线形文法**：产生式具有形式 $A \rightarrow w, A \rightarrow w B x, A, B\in V, w,x\in T^+$

- 左线性文法
- 右线性文法
- 左、右线性文法等价

**定理**：左线性文法的产生式与右线性文法的产生式混用所得到的文法不是正则文法

**定理**：有限状态自动机接受的语言是正则语言，正则语言能被有限状态自动机接受，即二者等价

- 根据 FA 构造左右线性文法（推导和归约）
- 根据左右线性文法构造自动机

### 正则语言的性质

**Pumping Lemma**：设 L 为正则语言，则存在只依赖于 L 的正整数 N，对于 $\forall z \in L$ 如果 $| z | \geq N$ 则存在 $u,v,w$ 满足：

1. $z=uvw$
2. $|uv| \leq N$
3. $|v| \geq 1$
4. $\forall i \geq 0, uv^i w \in L$
5. N 不大于接受 L 的最小 DFA 的状态数

**定理**：RL 在并、乘积、闭包、补、交运算下封闭

**Myhill-Nerode**：下述三个命题等价：

- $L\subset \Sigma^*$ 是 RL
- L 是 $\Sigma^*$ 上的的某一个具有有穷指数的右不变等价关系R的某些等价类的并
- $R_L$ 具有有穷指数

**DFA 的极小化**算法思想：扫描所有的状态对，找出所有的可区分的状态对，不可区分的状态对一定是等价的。


### 上下文无关语言

**CFG**：上下文无关文法为 $G=(V,T,P,S)$ 如果除了形如 $A \rightarrow \epsilon$ 的产生式之外，对于 $\forall \alpha \rightarrow \beta \in P$ 均有 $|\beta| \geq |\alpha|, \alpha \in V$ 成立。即无论变量 A 处于句型中的任何位置，都可以无视上下文将其通过产生式进行替换

**派生树/分析树/语法树**：从上下文无关文法的开始符号开始推导出的中间句型都可以对应一个结果为该句型的派生树

- 最左（右）派生：从句型的最左（右）边的变量开始进行推导
- 最右（左）归约

**定理**： 对于 CFG 的一个句子，存在其最左派生和最右派生，该句子的派生树和它们是一一对应的，且该派生树还可以有多个派生版本

**二义性**：对于文法产生的一个句子，若至少有两个派生树，则文法为二义的

**CFG 的化简**：

1. 去空产生式
2. 去单一产生式
3. 去无用符号

**Chomsky 范式**：CFG $G=(V,T,P,S)$ 的产生式都具有形式 $A \rightarrow BC, A \rightarrow a$

- 不允许出现单一产生式、空产生式

**Greibach 范式**：CFG $G=(V,T,P,S)$ 的产生式都具有形式 $A \rightarrow aA_1 A_2 \cdots, A \rightarrow a$

**定理**：对于任意上下文无关文法，如果该文法产生的语言不包含空串，则存在等价的 Chomsky 范式和 Greibach 范式


### 下推自动机

**Push-down Automata**： $M=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)$

- $\Gamma$ 是栈符号表
- $Z_0$ 是栈底符号
- $\delta: Q\times(\Sigma\cup \{\epsilon\})\times \Gamma \rightarrow 2^{Q\times \Gamma^*}$
  - $\delta(q,a,Z)=\{ (p_1,\gamma_1),(p_2,\gamma_2), \cdots \}$ 表示在状态 q 读入字符 a 当前栈顶符号为 Z 时，可以选择地将状态转移到 $p_1,p_2,\cdots$，并将栈顶符号 Z 弹出，将 $\gamma$ 中的符号从右到左依次压栈，然后将读头向右移动一个字符

**定理**：PDA 与 CFG 等价

> PDA由于有栈，具有存储功能，可以通过记录-存储状态转移接受需要进行计数的语言（例如相等0、1数的01串，回文串等）


### 上下文无关语言的性质

**Pumping Lemma**：对于任意的 CFL L，存在仅依赖于 L 的正整数 N，对于任意的 $z\in L$，当 $|z|\geq N$ 时，存在 $u,v,w,x,y$ 使得 $z=uvwxy$ 并满足：

- $|vwx| \leq N$
- $|vx| \geq 1$
- $\forall i \geq 0, uv^i w x^i y \in L$

**定理**：上下文无关语言在并、乘积、闭包运算下封闭，但在交、补运算下不封闭

**定理**：上下文无关语言与正则语言的交是上下文无关语言

**CYK算法**：给定上下文无关文法，用于判定某一个句子是否属于上下文无关语言


### 图灵机

图灵机(Turing machine)是由图灵(Alan Mathisom Turing)在1936年提出的，它是一个通用的计算模型。通过研究TM，来研究递归可枚举集(recursively enumerable set)和部分递归函数(partial recursive function)。对算法和可计算性研究提供形式化描述工具

**图灵机**： $M=(Q,\Sigma, \Gamma, \delta, q_0, B, F)$

- $\Gamma$ 是带符号表，若X为M的一个带符号，表示在M的运行过程中，X可以在某一时刻出现在输入带上
- $B\in \Gamma$ 是空白符
- $\delta: Q\times \Gamma \rightarrow Q\times \Gamma \times \{R,L\}$ 其中 R，L 表示读头向右/左移动
  - $\delta(q,X)=(p.Y,R)$ 表示 M 在状态 q 下读入符号 X，将状态改为 p，并在这个 X 所在的位置打印符号 Y，然后将读头向右移动一格

**用图灵机实现语言的识别**

**用图灵机实现可计算问题（正整数加、半减法、乘法、幂、阶乘）**