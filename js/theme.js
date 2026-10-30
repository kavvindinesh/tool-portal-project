// Shared light/dark theme toggle.
// The saved theme is applied early by a small inline script in each page's
// <head> (so there is no flash of the wrong theme); this file wires up the button.

(function () {
  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Storage can be blocked (e.g. private browsing); the toggle still works for this page.
    }
  }

  function updateButton(button) {
    var next = currentTheme() === "dark" ? "light" : "dark";
    button.textContent = next === "dark" ? "Dark theme" : "Light theme";
    button.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector(".theme-toggle");
    if (!button) return;

    updateButton(button);
    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      saveTheme(next);
      updateButton(button);
    });
  });
})();
