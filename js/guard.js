function requireAuth() {
  const savedSession = localStorage.getItem("crm_session");
  if (!savedSession) {
    window.location.href = "../html/index.html";
  }
}

function redirectIfAuthenticated() {
  const savedSession = localStorage.getItem("crm_session");
  if (savedSession) {
    window.location.href = "../html/dashboard.html";
  }
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("crm_session");
    window.location.href = "../html/index.html";
  });
}
