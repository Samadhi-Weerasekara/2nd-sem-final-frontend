document.addEventListener("DOMContentLoaded", () => {
  fetchVehiclesFromBackend();
});


// Sample data for testing
let vehicles = [];
let currentVehicleId = null; // Declare this at the top


// Function to fetch vehicle data from the backend
// Function to fetch vehicle data from the backend
function fetchVehiclesFromBackend() {
  fetch("http://localhost:8080/api/v1/vehicles/allvehicles", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      return response.json();
    })
    .then((data) => {
      vehicles = data.map((vehicle) => ({
        id: vehicle.vehicleCode, // Use vehicleCode as the unique ID
        licensePlate: vehicle.licensePlateNumber.trim(),
        category: vehicle.vehicleCategory.trim(),
        fuelType: vehicle.fuelType,
        status: vehicle.status,
        assignedStaff: vehicle.staffId,
        remarks: vehicle.remarks, // Use staffId or fall back to remarks
      }));

      console.log("Vehicles fetched successfully:", vehicles);
      loadVehicles(); // Load vehicles after fetching
    })
    .catch((error) => {
      console.error("Error fetching vehicles:", error);
    });
}

// Load vehicles into the table
function loadVehicles(filter = "") {
  const vehicleTableBody = document.getElementById("vehicleTableBody");
  vehicleTableBody.innerHTML = "";

  vehicles
    .filter((vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach((vehicle) => {
      const row = `
        <tr data-id="${vehicle.id}">
          <td>${vehicle.id}</td>
          <td>${vehicle.licensePlate}</td>
          <td>${vehicle.category}</td>
          <td>${vehicle.fuelType}</td>
          <td>${vehicle.status}</td>
          <td>${vehicle.assignedStaff}</td>
          <td>${vehicle.remarks}</td>
          
          <td>
            <button class="btn btn-sm" onclick="editVehicle('${vehicle.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm" onclick="deleteVehicle('${vehicle.id}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
          </td>
        </tr>
      `;
      vehicleTableBody.innerHTML += row;
    });
}

// Handle Save/Update vehicle
const vehicleForm = document.getElementById("vehicleForm");
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
    const vehicle = vehicles.find((v) => v.id === currentVehicleId);
    if (vehicle) {
      vehicle.licensePlate = licensePlate;
      vehicle.category = category;
      vehicle.fuelType = fuelType;
      vehicle.status = status;
      vehicle.assignedStaff = assignedStaff;
      vehicle.remarks = remarks;
    }
  } else {
    // Add new vehicle
    vehicles.push({
      id: vehicles.length ? Math.max(...vehicles.map((v) => v.id)) + 1 : 1, // Incrementing ID
      licensePlate,
      category,
      fuelType,
      status,
      assignedStaff,
      remarks,
    });
  }

  currentVehicleId = null; // Reset ID after save/update
  vehicleForm.reset();
  vehicleModal.hide();
  loadVehicles();
});

// Populate modal with vehicle details for editing
function editVehicle(id) {
  document.getElementById("vehicleModalLabel").innerText = "Edit Vehicle";
  currentVehicleId = id;
  const vehicle = vehicles.find((v) => v.id === id);
  if (vehicle) {
    currentVehicleId = id;
    document.getElementById("licensePlate").value = vehicle.licensePlate;
    document.getElementById("vehicleCategory").value = vehicle.category;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("status").value = vehicle.status;
    document.getElementById("assignedStaff").value = vehicle.assignedStaff;
    document.getElementById("remarks").value = vehicle.remarks;

    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("vehicleModal")
    ).show();
   
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
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      vehicles = vehicles.filter((v) => v.id !== id);
      loadVehicles();
      Swal.fire("Deleted!", "The vehicle has been deleted.", "success");
    }
  });
}

// Search vehicles
const searchInput = document.getElementById("searchVehicle");
searchInput.addEventListener("input", function () {
  loadVehicles(this.value);
});
