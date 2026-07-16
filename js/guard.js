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
