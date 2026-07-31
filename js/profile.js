// Check if the user is logged in before opening the profile page
requireAuth();

const profileForm = document.getElementById("profileForm");
const profileAvatar = document.getElementById("profileAvatar");
const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profileCompany = document.getElementById("profileCompany");
const profileCreatedAt = document.getElementById("profileCreatedAt");
const profileFullNameError = document.getElementById("profileFullNameError");
const profileSuccess = document.getElementById("profileSuccess");
const resetDataButton = document.getElementById("resetDataButton");

// Get the active user session from localStorage
const savedSession = localStorage.getItem("crm_session");
const session = JSON.parse(savedSession);

// Get all registered users from localStorage
const savedUsers = localStorage.getItem("crm_users");

// Convert saved users from a JSON string into an array
// Use an empty array if no users exist
const users = savedUsers ? JSON.parse(savedUsers) : [];

// Find the currently logged-in user by comparing IDs
const currentUser = users.find(function (user) {
  return user.id === session.userId;
});

// If the user does not exist remove the invalid session
// and redirect to the login page
if (!currentUser) {
  localStorage.removeItem("crm_session");
  window.location.href = "../index.html";
} else {
  // Show the first letter of the users name in the avatar
  profileAvatar.textContent = currentUser.fullName.charAt(0).toUpperCase();
  // Fill the form fields with the current users information
  profileFullName.value = currentUser.fullName;
  profileEmail.value = currentUser.email;
  profileCompany.value = currentUser.company;
  profileCreatedAt.value = new Date(currentUser.createdAt).toLocaleDateString();

  // Listen for the profile form submission
  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    profileFullNameError.textContent = "";
    profileSuccess.textContent = "";
    profileSuccess.classList.remove("no-changes");

    const updatedFullName = profileFullName.value.trim();
    const updatedCompany = profileCompany.value.trim();

    if (updatedFullName.length < 3) {
      profileFullNameError.textContent =
        "Full name must be at least 3 characters";
      return;
    }

    // Compare values BEFORE changing currentUser
    if (
      updatedFullName === currentUser.fullName &&
      updatedCompany === currentUser.company
    ) {
      profileSuccess.textContent = "No changes were made";
      profileSuccess.classList.add("no-changes");
      return;
    }

    // Update user data only after the comparison
    currentUser.fullName = updatedFullName;
    currentUser.company = updatedCompany;

    localStorage.setItem("crm_users", JSON.stringify(users));

    session.fullName = updatedFullName;
    localStorage.setItem("crm_session", JSON.stringify(session));

    profileAvatar.textContent = updatedFullName.charAt(0).toUpperCase();
    profileSuccess.textContent = "Profile updated successfully";
  });
  resetDataButton.addEventListener("click", function () {
    const isConfirmed = confirm(
      "Are you sure you want to reset all CRM client data?",
    );

    if (!isConfirmed) {
      return;
    }

    // Remove only saved CRM clients
    localStorage.removeItem("crm_clients");

    // Dashboard will load the original clients from the API again
    window.location.href = "../html/dashboard.html";
  });
}
