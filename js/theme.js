const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

const savedTheme = localStorage.getItem("crm_theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const isDarkTheme = document.body.classList.contains("dark-theme");
    const nextTheme = isDarkTheme ? "light" : "dark";

    localStorage.setItem("crm_theme", nextTheme);
    applyTheme(nextTheme);
  });
}
