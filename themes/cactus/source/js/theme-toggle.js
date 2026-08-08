(function setupColorThemeToggle() {
  var root = document.documentElement;
  var button = document.getElementById("color-theme-toggle");
  var darkStylesheet = document.getElementById("theme-dark-stylesheet");
  var themeColor = document.getElementById("theme-color");
  var themeState = window.chiaroColorTheme || {
    mode: "light",
    storageKey: "chiaro-color-theme"
  };

  if (!button || !darkStylesheet) {
    return;
  }

  function applyTheme(mode, persist) {
    var isDark = mode === "dark";
    var actionLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
    var icon = button.querySelector(".theme-toggle__icon");

    darkStylesheet.disabled = !isDark;
    root.dataset.colorTheme = mode;
    root.style.colorScheme = mode;
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", actionLabel);
    button.setAttribute("title", actionLabel);

    if (icon) {
      icon.textContent = isDark ? "☀" : "☾";
    }

    if (themeColor) {
      themeColor.setAttribute("content", isDark ? "#202225" : "#fafafa");
    }

    themeState.mode = mode;

    if (persist) {
      try {
        localStorage.setItem(themeState.storageKey, mode);
      } catch (error) {
        // The theme still works when browser storage is unavailable.
      }
    }
  }

  applyTheme(themeState.mode, false);

  button.addEventListener("click", function() {
    applyTheme(themeState.mode === "dark" ? "light" : "dark", true);
  });
}());
