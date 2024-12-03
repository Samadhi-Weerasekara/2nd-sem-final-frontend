// Sample data for testing
let vehicles = [
  {
    id: 1,
    code: "VH001",
    licensePlate: "ABC-1234",
    category: "Truck",
    fuelType: "Diesel",
    status: "Available",
    assignedStaff: "John Doe",
    remarks: "Needs inspection"
  },
  {
    id: 2,
    code: "VH002",
    licensePlate: "XYZ-5678",
    category: "Car",
    fuelType: "Petrol",
    status: "Out of Service",
    assignedStaff: "Jane Smith",
    remarks: "Repair scheduled"
  }
];

// Elements
const vehicleTableBody = document.getElementById("vehicleTableBody");
const vehicleForm = document.getElementById("vehicleForm");
const vehicleModal = new bootstrap.Modal(document.getElementById("vehicleModal"));
const searchInput = document.getElementById("searchVehicle");

let currentVehicleId = null; // For tracking the vehicle being edited

// Load vehicles into table
function loadVehicles(filter = "") {
  vehicleTableBody.innerHTML = "";

  vehicles
    .filter(vehicle =>
      vehicle.code.toLowerCase().includes(filter.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(vehicle => {
      const row = `
        <tr data-id="${vehicle.id}">
          <td>${vehicle.code}</td>
          <td>${vehicle.licensePlate}</td>
          <td>${vehicle.category}</td>
          <td>${vehicle.fuelType}</td>
          <td>${vehicle.status}</td>
          <td>${vehicle.assignedStaff}</td>
          <td>${vehicle.remarks}</td>
          <td>
            <button class="btn  btn-sm" onclick="editVehicle(${vehicle.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn  btn-sm" onclick="deleteVehicle(${vehicle.id})"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
          </td>
        </tr>
      `;
      vehicleTableBody.innerHTML += row;
    });
}

// Handle Save/Update vehicle
vehicleForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const licensePlate = document.getElementById("licensePlate").value;
  const category = document.getElementById("vehicleCategory").value;
  const fuelType = document.getElementById("fuelType").value;
  const status = document.getElementById("status").value;
  const assignedStaff = document.getElementById("assignedStaff").value;
  const remarks = document.getElementById("remarks").value;

  if (currentVehicleId) {
    // Update existing vehicle
    const vehicle = vehicles.find(v => v.id === currentVehicleId);
    vehicle.licensePlate = licensePlate;
    vehicle.category = category;
    vehicle.fuelType = fuelType;
    vehicle.status = status;
    vehicle.assignedStaff = assignedStaff;
    vehicle.remarks = remarks;
  } else {
    // Add new vehicle
    vehicles.push({
      id: vehicles.length ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
      code: `VH${String(vehicles.length + 1).padStart(3, "0")}`,
      licensePlate,
      category,
      fuelType,
      status,
      assignedStaff,
      remarks
    });
  }

  currentVehicleId = null;
  vehicleForm.reset();
  vehicleModal.hide();
  loadVehicles();
});

// Populate modal with vehicle details for editing
function editVehicle(id) {
  const vehicle = vehicles.find(v => v.id === id);
  if (vehicle) {
    currentVehicleId = id;
    document.getElementById("licensePlate").value = vehicle.licensePlate;
    document.getElementById("vehicleCategory").value = vehicle.category;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("status").value = vehicle.status;
    document.getElementById("assignedStaff").value = vehicle.assignedStaff;
    document.getElementById("remarks").value = vehicle.remarks;
    vehicleModal.show();
  }
}

// Delete vehicle with confirmation
function deleteVehicle(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this vehicle?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  }).then(result => {
    if (result.isConfirmed) {
      vehicles = vehicles.filter(v => v.id !== id);
      loadVehicles();
      Swal.fire("Deleted!", "The vehicle has been deleted.", "success");
    }
  });
}

// Search vehicles
searchInput.addEventListener("input", function () {
  loadVehicles(this.value);
});

// Initial load
loadVehicles();
