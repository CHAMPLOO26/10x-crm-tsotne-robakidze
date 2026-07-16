async function loadClients() {
  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients) {
    return JSON.parse(savedClients);
  }

  const response = await fetch("https://dummyjson.com/users?limit=30");

  if (!response.ok) {
    throw new Error("could not load clients");
  }

  const data = await response.json();

  const statuses = ["Lead", "Contacted", "Won", "Lost"];

  const clients = data.users.map(function (user, index) {
    return {
      id: user.id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      phone: user.phone,
      company: user.company.name,
      image: user.image,
      status: statuses[index % statuses.length],
      dealValue: (index + 1) * 1000,
      notes: [],
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    };
  });

  localStorage.setItem("crm_clients", JSON.stringify(clients));

  return clients;
}
