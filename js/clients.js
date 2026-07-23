requireAuth();

const clientsGrid = document.getElementById("clientsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const addClientButton = document.getElementById("addClientButton");

const filterButtons = document.querySelectorAll(".filter-chip");

const clientModal = document.getElementById("clientModal");
const addClientForm = document.getElementById("addClientForm");
const closeModalButton = document.getElementById("closeModalButton");
const cancelModalButton = document.getElementById("cancelModalButton");

let clients = [];
let activeStatus = "All";
let searchValue = "";
let sortValue = "newest";

function renderClients() {
  clientsGrid.innerHTML = "";
  clientsGrid.classList.remove("empty-state");

  let visibleClients = [...clients];

  if (activeStatus !== "All") {
    visibleClients = visibleClients.filter(function (client) {
      return client.status === activeStatus;
    });
  }

  if (searchValue.length !== 0) {
    visibleClients = visibleClients.filter(function (client) {
      return (
        client.name.toLowerCase().includes(searchValue) ||
        client.company.toLowerCase().includes(searchValue) ||
        client.email.toLowerCase().includes(searchValue)
      );
    });
  }

  if (sortValue === "newest") {
    visibleClients.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (sortValue === "name") {
    visibleClients.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (sortValue === "dealValue") {
    visibleClients.sort(function (a, b) {
      return b.dealValue - a.dealValue;
    });
  }

  if (visibleClients.length === 0) {
    clientsGrid.textContent = "No clients found";
    clientsGrid.classList.add("empty-state");
    return;
  }

  visibleClients.forEach(function (client) {
    //create new element
    const clientCard = document.createElement("article");
    clientCard.classList.add("client-card");

    const clientHeader = document.createElement("div");
    clientHeader.classList.add("client-header");

    const avatar = document.createElement("img");
    avatar.src = client.image;
    avatar.alt = client.name;
    avatar.classList.add("client-avatar");

    const clientIdentity = document.createElement("div");
    clientIdentity.classList.add("client-identity");

    const clientName = document.createElement("h3");
    clientName.textContent = client.name;

    const clientCompany = document.createElement("p");
    clientCompany.textContent = client.company;

    clientIdentity.append(clientName, clientCompany);
    clientHeader.append(avatar, clientIdentity);

    const clientDetails = document.createElement("div");
    clientDetails.classList.add("client-details");

    const statusBadge = document.createElement("span");
    statusBadge.classList.add("status-badge");
    statusBadge.textContent = client.status;

    const dealValue = document.createElement("p");
    dealValue.classList.add("deal-value");
    dealValue.textContent = `$${client.dealValue.toLocaleString()}`;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    const viewButton = document.createElement("button");
    viewButton.classList.add("view-button");
    viewButton.textContent = "View details";

    clientDetails.append(statusBadge, dealValue, viewButton, deleteButton);

    clientCard.append(clientHeader, clientDetails);
    clientsGrid.append(clientCard);

    viewButton.addEventListener("click", function () {
      //button takes us to client-details page
      window.location.href = `../html/client-details.html?id=${client.id}`;
    });
    // button delets clients info 
    deleteButton.addEventListener("click", function () {
      const isConfirmed = confirm(
        "Are you sure you want to delete this client?",
      );
       //if isConfirmed is not confirmed nothing happends
      if (!isConfirmed) {
        return;
      }
         
      clients = clients.filter(function (oneClient) {
        return oneClient.id !== client.id;
      });

      localStorage.setItem("crm_clients", JSON.stringify(clients));
      renderClients();
    });
  });
}

async function initializeClientsPage() {
  clients = await loadClients();
  renderClients();
}

initializeClientsPage();

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    activeStatus = button.dataset.status;

    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    renderClients();
  });
});

searchInput.addEventListener("input", function () {
  searchValue = searchInput.value.trim().toLowerCase();
  renderClients();
});

sortSelect.addEventListener("change", function () {
  sortValue = sortSelect.value;
  renderClients();
});

addClientButton.addEventListener("click", () => {
  clientModal.classList.remove("hidden");
});
closeModalButton.addEventListener("click", () => {
  clientModal.classList.add("hidden");
});
cancelModalButton.addEventListener("click", () => {
  clientModal.classList.add("hidden");
});

const clientNameInput = document.getElementById("clientName");
const clientEmailInput = document.getElementById("clientEmail");
const clientPhoneInput = document.getElementById("clientPhone");
const clientCompanyInput = document.getElementById("clientCompany");
const clientDealValueInput = document.getElementById("clientDealValue");
const clientStatusInput = document.getElementById("clientStatus");

const clientNameError = document.getElementById("clientNameError");
const clientEmailError = document.getElementById("clientEmailError");
const clientPhoneError = document.getElementById("clientPhoneError");
const clientDealValueError = document.getElementById("clientDealValueError");

const toast = document.getElementById("toast");

addClientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clientNameError.textContent = "";
  clientEmailError.textContent = "";
  clientPhoneError.textContent = "";
  clientDealValueError.textContent = "";

  const clientName = clientNameInput.value.trim();
  const clientEmail = clientEmailInput.value.trim();
  const clientPhone = clientPhoneInput.value.trim();
  const clientCompany = clientCompanyInput.value.trim();
  const clientDealValue = Number(clientDealValueInput.value);
  const clientStatus = clientStatusInput.value;

  let hasError = false;

  if (clientName.length === 0) {
    clientNameError.textContent = "Client name is required";
    hasError = true;
  }
  if (clientEmail.length === 0) {
    clientEmailError.textContent = "Client email is required";
    hasError = true;
  }
  if (clientDealValue <= 0) {
    clientDealValueError.textContent = "Deal value must be greater than 0";
    hasError = true;
  }

  //email validation finding out if it contains @ and dot after @
  const atIndex = clientEmail.indexOf("@");
  const dotInder = clientEmail.indexOf(".", atIndex + 1);

  // if email input contains @ and "." after @ and if input also exicts
  let isEmailValid =
    clientEmail.length > 0 && atIndex !== -1 && dotInder !== -1;
  //if not
  if (clientEmail.length > 0 && !isEmailValid) {
    clientEmailError.textContent = "Please enter a valid email address";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const newClient = {
    id: Date.now(),
    name: clientName,
    email: clientEmail,
    phone: clientPhone,
    company: clientCompany,
    status: clientStatus,
    dealValue: clientDealValue,
    notes: [],
    createdAt: new Date().toISOString(),
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}`,
  };

  clients.push(newClient);
  localStorage.setItem("crm_clients", JSON.stringify(clients));
  renderClients();
  addClientForm.reset();
  clientModal.classList.add("hidden");

  toast.textContent = "Client added successfully";
  toast.classList.remove("hidden");
  setTimeout(function () {
    toast.classList.add("hidden");
  }, 2000);
});
