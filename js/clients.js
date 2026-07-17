requireAuth();

const clientsGrid = document.getElementById("clientsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const addClientButton = document.getElementById("addClientButton");

const filterButtons = document.querySelectorAll(".filter-chip");

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

    clientDetails.append(statusBadge, dealValue);

    clientCard.append(clientHeader, clientDetails);
    clientsGrid.append(clientCard);
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
