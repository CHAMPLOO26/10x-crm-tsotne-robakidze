requireAuth();

const profileForm = document.getElementById("profileForm");
const profileAvatar = document.getElementById("profileAvatar");
const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profileCompany = document.getElementById("profileCompany");
const profileCreatedAt = document.getElementById("profileCreatedAt");
const profileFullNameError = document.getElementById("profileFullNameError");
const profileSuccess = document.getElementById("profileSuccess");

const savedSession = localStorage.getItem("crm_session");
const session = JSON.parse(savedSession);

const savedUsers = localStorage.getItem("crm_users");
const users = savedUsers ? JSON.parse(savedUsers) : [];

const currentUser = users.find(function (user) {
  return user.id === session.userId;
});

if (!currentUser) {
  localStorage.removeItem("crm_session");
  window.location.href = "../html/index.html";
} else {
  profileAvatar.textContent = currentUser.fullName.charAt(0).toUpperCase();
  profileFullName.value = currentUser.fullName;
  profileEmail.value = currentUser.email;
  profileCompany.value = currentUser.company;
  profileCreatedAt.value = new Date(currentUser.createdAt).toLocaleDateString();

  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    profileFullNameError.textContent = "";
    profileSuccess.textContent = "";

    const updatedFullName = profileFullName.value.trim();
    const updatedCompany = profileCompany.value.trim();

    if (updatedFullName.length < 3) {
      profileFullNameError.textContent =
        "Full name must be at least 3 characters";
      return;
    }

    currentUser.fullName = updatedFullName;
    currentUser.company = updatedCompany;

    localStorage.setItem("crm_users", JSON.stringify(users));

    session.fullName = updatedFullName;
    localStorage.setItem("crm_session", JSON.stringify(session));

    profileAvatar.textContent = updatedFullName.charAt(0).toUpperCase();
    profileSuccess.textContent = "Profile updated successfully";
  });
}
