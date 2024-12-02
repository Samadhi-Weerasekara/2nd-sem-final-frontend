// Sample array to store vehicle data
let vehicles = [];

// Function to display vehicles in the table
function populateTable() {
  const tableBody = document.getElementById("vehicleTableBody");
  tableBody.innerHTML = ""; // Clear the table

  vehicles.forEach((vehicle, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${vehicle.code}</td>
      <td>${vehicle.licensePlate}</td>
      <td>${vehicle.category}</td>
      <td>${vehicle.fuelType}</td>
      <td>${vehicle.status}</td>
      <td>${vehicle.assignedStaff}</td>
      <td>${vehicle.remarks}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editVehicle(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Function to add or edit a vehicle
function saveVehicle(event) {
  event.preventDefault();

  const vehicleId = document.getElementById("vehicleId").value;
  const licensePlate = document.getElementById("licensePlate").value;
  const category = document.getElementById("vehicleCategory").value;
  const fuelType = document.getElementById("fuelType").value;
  const status = document.getElementById("status").value;
  const assignedStaff = document.getElementById("assignedStaff").value;
  const remarks = document.getElementById("remarks").value;

  const vehicle = {
    code: vehicleId || V${Date.now()}, // Generate a unique code if not editing
    licensePlate,
    category,
    fuelType,
    status,
    assignedStaff,
    remarks,
  };

  if (vehicleId) {
    // Edit existing vehicle
    const index = vehicles.findIndex((v) => v.code === vehicleId);
    vehicles[index] = vehicle;
  } else {
    // Add new vehicle
    vehicles.push(vehicle);
  }

  // Close the modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("vehicleModal"));
  modal.hide();

  // Reset the form
  document.getElementById("vehicleForm").reset();
  document.getElementById("vehicleId").value = "";

  // Update the table
  populateTable();
}

// Function to delete a vehicle
function deleteVehicle(index) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    vehicles.splice(index, 1);
    populateTable();
  }
}

// Function to edit a vehicle
function editVehicle(index) {
  const vehicle = vehicles[index];

  document.getElementById("vehicleId").value = vehicle.code;
  document.getElementById("licensePlate").value = vehicle.licensePlate;
  document.getElementById("vehicleCategory").value = vehicle.category;
  document.getElementById("fuelType").value = vehicle.fuelType;
  document.getElementById("status").value = vehicle.status;
  document.getElementById("assignedStaff").value = vehicle.assignedStaff;
  document.getElementById("remarks").value = vehicle.remarks;

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("vehicleModal"));
  modal.show();
}

// Function to search vehicles
function searchVehicle() {
  const query = document.getElementById("searchVehicle").value.toLowerCase();
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.code.toLowerCase().includes(query) ||
      v.licensePlate.toLowerCase().includes(query)
  );

  const tableBody = document.getElementById("vehicleTableBody");
  tableBody.innerHTML = "";

  filteredVehicles.forEach((vehicle, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${vehicle.code}</td>
      <td>${vehicle.licensePlate}</td>
      <td>${vehicle.category}</td>
      <td>${vehicle.fuelType}</td>
      <td>${vehicle.status}</td>
      <td>${vehicle.assignedStaff}</td>
      <td>${vehicle.remarks}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editVehicle(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Add event listener to the form
document.getElementById("vehicleForm").addEventListener("submit", saveVehicle);