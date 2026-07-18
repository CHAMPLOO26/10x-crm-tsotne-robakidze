requireAuth();

const clientAvatar = document.getElementById("clientAvatar");
const clientName = document.getElementById("clientName");
const clientCompany = document.getElementById("clientCompany");
const clientStatus = document.getElementById("clientStatus");

const clientEmail = document.getElementById("clientEmail");
const clientPhone = document.getElementById("clientPhone");
const clientCreatedAt = document.getElementById("clientCreatedAt");
const clientDealValue = document.getElementById("clientDealValue");
const clientStatusText = document.getElementById("clientStatusText");

const notesList = document.getElementById("notesList");
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const noteError = document.getElementById("noteError");

const params = new URLSearchParams(window.location.search);
const clientId = Number(params.get("id"));

let clients = [];

function renderNotes(client) {
  notesList.innerHTML = "";

  if (client.notes.length === 0) {
    notesList.textContent = "No notes yet";
  } else {
    client.notes.forEach(function (note, index) {
      const noteItem = document.createElement("div");
      noteItem.classList.add("note-item");

      const noteText = document.createElement("p");
      noteText.textContent = note.text;

      const noteDate = document.createElement("small");
      noteDate.textContent = new Date(note.createdAt).toLocaleDateString();

      const deleteNoteButton = document.createElement("button");
      deleteNoteButton.classList.add("delete-note-button");
      deleteNoteButton.textContent = "Delete";

      deleteNoteButton.addEventListener("click", function () {
        const isConfirmed = confirm(
          "Are you sure you want to delete this note?",
        );

        if (!isConfirmed) {
          return;
        }

        client.notes.splice(index, 1);
        localStorage.setItem("crm_clients", JSON.stringify(clients));
        renderNotes(client);
      });

      noteItem.append(noteText, noteDate, deleteNoteButton);
      notesList.append(noteItem);
    });
  }
}

async function initializeClientsDetails() {
  clients = await loadClients();
  const client = clients.find((oneClient) => {
    return oneClient.id === clientId;
  });
  if (!client) {
    window.location.href = "../html/clients.html";
    return;
  }

  clientAvatar.src = client.image;
  clientAvatar.alt = client.name;
  clientName.textContent = client.name;
  clientCompany.textContent = client.company;
  clientStatus.textContent = client.status;

  clientEmail.textContent = client.email;
  clientPhone.textContent = client.phone;
  clientCreatedAt.textContent = new Date(client.createdAt).toLocaleDateString();

  clientDealValue.textContent = `$${client.dealValue.toLocaleString()}`;
  clientStatusText.textContent = client.status;

  renderNotes(client);

  noteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    noteError.textContent = "";
    const noteText = noteInput.value.trim();
    if (noteText.length === 0) {
      noteError.textContent = "Note cannot be empty";
      return;
    }

    const newNote = {
      text: noteText,
      createdAt: new Date().toISOString(),
    };

    client.notes.push(newNote);
    localStorage.setItem("crm_clients", JSON.stringify(clients));
    renderNotes(client);
    noteForm.reset();
  });
}
initializeClientsDetails();
