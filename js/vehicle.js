// Mock data storage
let vehicles = [];
let vehicleCounter = 1;

// Generate a new vehicle code
function generateVehicleCode() {
  const code = `VEH-${String(vehicleCounter).padStart(4, "0")}`;
  vehicleCounter++;
  return code;
}

// Add or update vehicle
document.getElementById("vehicleForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const vehicleId = document.getElementById("vehicleId").value;
  const vehicleCode = document.getElementById("vehicleCode").value;
  const licensePlate = document.getElementById("licensePlate").value.trim();
  const category = document.getElementById("vehicleCategory").value;
  const fuelType = document.getElementById("fuelType").value;
  const status = document.getElementById("status").value;
  const assignedStaff = document.getElementById("assignedStaff").value.trim();
  const remarks = document.getElementById("remarks").value.trim();

  const newVehicle = {
    vehicleCode,
    licensePlate,
    category,
    fuelType,
    status,
    assignedStaff,
    remarks,
  };

  if (vehicleId) {
    // Update vehicle
    const index = vehicles.findIndex((v) => v.vehicleCode === vehicleId);
    vehicles[index] = newVehicle;
  } else {
    // Add new vehicle
    newVehicle.vehicleCode = generateVehicleCode();
    vehicles.push(newVehicle);
  }

  refreshTable();
  clearForm();
  bootstrap.Modal.getInstance(document.getElementById("vehicleModal")).hide();
});

// Refresh table
function refreshTable() {
  const tableBody = document.getElementById("vehicleTableBody");
  tableBody.innerHTML = "";

  vehicles.forEach((vehicle) => {
    const row = `
      <tr>
        <td>${vehicle.vehicleCode}</td>
        <td>${vehicle.licensePlate}</td>
        <td>${vehicle.category}</td>
        <td>${vehicle.fuelType}</td>
        <td>${vehicle.status}</td>
        <td>${vehicle.assignedStaff}</td>
        <td>${vehicle.remarks}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editVehicle('${vehicle.vehicleCode}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteVehicle('${vehicle.vehicleCode}')">Delete</button>
        </td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Clear form
function clearForm() {
  document.getElementById("vehicleId").value = "";
  document.getElementById("vehicleCode").value = generateVehicleCode();
  document.getElementById("licensePlate").value = "";
  document.getElementById("vehicleCategory").value = "";
  document.getElementById("fuelType").value = "";
  document.getElementById("status").value = "";
  document.getElementById("assignedStaff").value = "";
  document.getElementById("remarks").value = "";
}

// Edit vehicle
function editVehicle(vehicleCode) {
  const vehicle = vehicles.find((v) => v.vehicleCode === vehicleCode);

  document.getElementById("vehicleId").value = vehicle.vehicleCode;
  document.getElementById("vehicleCode").value = vehicle.vehicleCode;
  document.getElementById("licensePlate").value = vehicle.licensePlate;
  document.getElementById("vehicleCategory").value = vehicle.category;
  document.getElementById("fuelType").value = vehicle.fuelType;
  document.getElementById("status").value = vehicle.status;
  document.getElementById("assignedStaff").value = vehicle.assignedStaff;
  document.getElementById("remarks").value = vehicle.remarks;

  const vehicleModal = new bootstrap.Modal(document.getElementById("vehicleModal"));
  vehicleModal.show();
}

// Delete vehicle
function deleteVehicle(vehicleCode) {
  vehicles = vehicles.filter((v) => v.vehicleCode !== vehicleCode);
  refreshTable();
}

// Initialize form with auto-generated code
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("vehicleCode").value = generateVehicleCode();
});
