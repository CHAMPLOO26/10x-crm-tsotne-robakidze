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
  let visibleClients = [...clients];
  if (activeStatus !== "All") {
    visibleClients = visibleClients.filter((client) => {
      return client.status === activeStatus;
    });
  }

  if (sortValue === "newest") {
    visibleClients.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  } else if (sortValue === "name") {
    visibleClients.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "dealValue") {
    visibleClients.sort((a, b) => b.dealValue - a.dealValue);
  }

  if (visibleClients.length === 0) {
    clientsGrid.textContent = "No clients found";
    clientsGrid.classList.add("empty-state");
    return;
  }

  visibleClients.forEach((client) => {
    const clientCard = document.createElement("article");
    clientCard.classList.add("client-card");

    const clientHeader = document.createElement("div");
    clientHeader.classList.add("client-header");
    const avatar = document.createElement("img");
    avatar.src = client.image;
    avatar.alt = client.name;
    avatar.classList.add("client-avatar");
    clientHeader.append(avatar);

    const clientDetails = document.createElement("div");
    clientDetails.classList.add("client-details");
    const statusBadge = document.createElement("span");
    statusBadge.classList.add("status-badge");
    statusBadge.textContent = client.status;

    const dealValue = document.createElement("p");
    dealValue.classList.add("deal-value");
    dealValue.textContent = `$ ${client.dealValue.toLocaleString()}`;

    clientDetails.append(statusBadge, dealValue);

    const clinetIdentity = document.createElement("div");
    clinetIdentity.classList.add("client-identity");
    const clinetIdentityH3 = document.createElement("h3");
    const clinetIdentityP = document.createElement("p");
    clinetIdentityH3.textContent = client.name;
    clinetIdentityP.textContent = client.company;
    clinetIdentity.append(clinetIdentityH3, clinetIdentityP);
    clientHeader.append(clinetIdentity);

    clientCard.append(clientHeader);
    clientCard.append(clientDetails);
    clientsGrid.append(clientCard);
  });
}

async function initializeClientsPage() {
  clients = await loadClients();
  renderClients();
}

initializeClientsPage();
