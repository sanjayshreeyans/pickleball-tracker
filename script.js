document.addEventListener("DOMContentLoaded", () => {
  const friends = ["Sanjay", "Ram", "Sripath & Shanmuk", "Sid Ravi", "Sid Balaji", "Aditiya"];
  const statuses = ["Coming", "Arrived", "Not Interested"];

  // Display the current date
  const today = new Date().toDateString();
  document.getElementById("date").textContent = today;

  // Load stored statuses or initialize
  const storedStatuses = JSON.parse(localStorage.getItem("statuses")) || {};

  // Reset statuses if date has changed
  if (storedStatuses.date !== today) {
    localStorage.setItem(
      "statuses",
      JSON.stringify({ date: today, friends: {} })
    );
  }

  // Populate the table with names and statuses
  const tableBody = document.getElementById("statusTable");
  friends.forEach((name) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    row.appendChild(nameCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = storedStatuses.friends?.[name] || "No Status";
    row.appendChild(statusCell);

    const updateCell = document.createElement("td");
    statuses.forEach((status) => {
      const button = document.createElement("button");
      button.textContent = status;
      button.onclick = () => {
        storedStatuses.friends[name] = status;
        localStorage.setItem("statuses", JSON.stringify(storedStatuses));
        statusCell.textContent = status;
      };
      updateCell.appendChild(button);
    });
    row.appendChild(updateCell);

    tableBody.appendChild(row);
  });
});
