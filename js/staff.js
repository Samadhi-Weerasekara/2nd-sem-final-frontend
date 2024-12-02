// Sample data to simulate vehicle records (in a real app, this would come from a database)
let vehicles = [
  {
    id: 1,
    licensePlate: "ABC-1234",
    category: "Sedan",
    fuelType: "Petrol",
    status: "Active",
    assignedStaff: "John Doe",
    remarks: "Regular maintenance",
    joinedDate: "2022-01-10",
  },
  {
    id: 2,
    licensePlate: "XYZ-5678",
    category: "SUV",
    fuelType: "Diesel",
    status: "Inactive",
    assignedStaff: "Jane Smith",
    remarks: "Needs repair",
    joinedDate: "2022-02-15",
  },
  // Add more sample vehicles as needed
];

// Function to open the modal and reset the form for adding vehicles
function openAddVehicleModal() {
  document.getElementById("vehicleForm").reset();
  document.getElementById("vehicleId").value = ""; // Clear vehicle ID for new entry
  document.getElementById("vehicleModalLabel").innerText = "Add Vehicle"; // Change modal title
  new bootstrap.Modal(document.getElementById("vehicleModal")).show(); // Show the modal
}

// Function to save vehicle data (add or edit)
function saveVehicle(event) {
  event.preventDefault(); // Prevent form submission

  const vehicleId = document.getElementById("vehicleId").value;
  const licensePlate = document.getElementById("licensePlate").value;
  const category = document.getElementById("vehicleCategory").value;
  const fuelType = document.getElementById("fuelType").value;
  const status = document.getElementById("status").value;
  const assignedStaff = document.getElementById("assignedStaff").value;
  const remarks = document.getElementById("remarks").value;
  const joinedDate = document.getElementById("joinedDate").value;

  if (vehicleId) {
    // Edit existing vehicle
    const vehicleIndex = vehicles.findIndex((vehicle) => vehicle.id == vehicleId);
    if (vehicleIndex > -1) {
      vehicles[vehicleIndex] = {
        id: vehicleId,
        licensePlate,
        category,
        fuelType,
        status,
        assignedStaff,
        remarks,
        joinedDate,
      };
    }
  } else {
    // Add new vehicle
    const newVehicle = {
      id: vehicles.length + 1, // Simple ID generation
      licensePlate,
      category,
      fuelType,
      status,
      assignedStaff,
      remarks,
      joinedDate,
    };
    vehicles.push(newVehicle);
  }

  // Update the table and close the modal
  updateVehicleTable();
  new bootstrap.Modal(document.getElementById("vehicleModal")).hide();
}

// Function to update the vehicle table with the current vehicles
function updateVehicleTable() {
  const vehicleTableBody = document.getElementById("vehicleTableBody");
  vehicleTableBody.innerHTML = ""; // Clear existing rows

  vehicles.forEach((vehicle) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${vehicle.id}</td>
      <td>${vehicle.licensePlate}</td>
      <td>${vehicle.category}</td>
      <td>${vehicle.fuelType}</td>
      <td>${vehicle.status}</td>
      <td>${vehicle.assignedStaff}</td>
      <td>${vehicle.remarks}</td>
      <td>${vehicle.joinedDate}</td>
      <td>
        <div class="btn btn-sm" onclick="editVehicle(${vehicle.id})"><i class="fa-solid fa-pen"></i></div>
        <div class="btn btn-sm" onclick="deleteVehicle(${vehicle.id})"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></div>
      </td>
    `;
    vehicleTableBody.appendChild(row);
  });
}

// Function to edit a vehicle
function editVehicle(id) {
  const vehicle = vehicles.find((vehicle) => vehicle.id === id);
  if (vehicle) {
    document.getElementById("vehicleId").value = vehicle.id;
    document.getElementById("licensePlate").value = vehicle.licensePlate;
    document.getElementById("vehicleCategory").value = vehicle.category;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("status").value = vehicle.status;
    document.getElementById("assignedStaff").value = vehicle.assignedStaff;
    document.getElementById("remarks").value = vehicle.remarks;
    document.getElementById("joinedDate").value = vehicle.joinedDate;

    document.getElementById("vehicleModalLabel").innerText = "Edit Vehicle"; // Change modal title
    openAddVehicleModal(); // Open the modal
  }
}

// Function to delete a vehicle
function deleteVehicle(id) {
  vehicles = vehicles.filter((vehicle) => vehicle.id !== id);
  updateVehicleTable();
}

// Function to search for vehicles by license plate
function searchVehicle() {
  const query = document.getElementById("searchVehicle").value.toLowerCase();
  const filteredVehicles = vehicles.filter((vehicle) => {
    return vehicle.licensePlate.toLowerCase().includes(query);
  });

  // Update the table with filtered results
  const vehicleTableBody = document.getElementById("vehicleTableBody");
  vehicleTableBody.innerHTML = ""; // Clear existing rows

  filteredVehicles.forEach((vehicle) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${vehicle.id}</td>
      <td>${vehicle.licensePlate}</td>
      <td>${vehicle.category}</td>
      <td>${vehicle.fuelType}</td>
      <td>${vehicle.status}</td>
      <td>${vehicle.assignedStaff}</td>
      <td>${vehicle.remarks}</td>
      <td>${vehicle.joinedDate}</td>
      <td>
        <button class="btn btn-info" onclick="editVehicle(${vehicle.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteVehicle(${vehicle.id})">Delete</button>
      </td>
    `;
    vehicleTableBody.appendChild(row);
  });
}

// Event listener for form submission
document.getElementById("vehicleForm").addEventListener("submit", saveVehicle);

// Initial population of the vehicle table
updateVehicleTable();
