document.addEventListener("DOMContentLoaded", () => {
  fetchVehiclesFromBackend();

  // Manage modal focus and background element tabindex
  $('#vehicleModal').on('shown.bs.modal', function () {
    $(this).find('button, [href], input, select, textarea').first().focus();
    $('.background-elements').attr('tabindex', '-1');
  });

  $('#vehicleModal').on('hidden.bs.modal', function () {
    $('.background-elements').removeAttr('tabindex');
    resetForm();
  });
});

let currentVehicleId = null; // Track the vehicle being edited
let vehicles = [];

// Fetch vehicles from the backend
async function fetchVehiclesFromBackend() {
  try {
    const response = await fetch("http://localhost:8080/api/v1/vehicles/allvehicles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vehicles");
    }

    const data = await response.json();
    vehicles = data.map(vehicle => ({
      id: vehicle.vehicleCode,
      licensePlate: vehicle.licensePlateNumber.trim(),
      category: vehicle.vehicleCategory.trim(),
      fuelType: vehicle.fuelType,
      status: vehicle.status,
      assignedStaff: vehicle.staffId,
      remarks: vehicle.remarks,
    }));

    console.log("Vehicles fetched successfully:", vehicles);
    initValues(); // Load vehicles into the table after fetching
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
}

// Initialize vehicle table values
function initValues() {
  const vehicleTableBody = document.getElementById("vehicleTableBody");
  vehicleTableBody.innerHTML = "";

  vehicles.forEach(vehicle => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(vehicle);
    vehicleTableBody.appendChild(row);
  });
}

// Generate Table Row HTML
function generateRowHTML(vehicle) {
  return `
    <td>${vehicle.id}</td>
    <td>${vehicle.licensePlate}</td>
    <td>${vehicle.category}</td>
    <td>${vehicle.fuelType}</td>
    <td>${vehicle.status}</td>
    <td>${vehicle.assignedStaff || 'N/A'}</td>
    <td>${vehicle.remarks || 'N/A'}</td>
    <td>
      <button class="btn btn-sm" onclick="editVehicle('${vehicle.id}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-sm" onclick="deleteVehicle('${vehicle.id}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
  `;
}

// Add/Edit Vehicle Form Submit
document.getElementById("vehicleForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const licensePlate = document.getElementById("licensePlate").value;
  const category = document.getElementById("vehicleCategory").value;
  const fuelType = document.getElementById("fuelType").value;
  const status = document.getElementById("status").value;
  const assignedStaff = document.getElementById("assignedStaff").value;
  const remarks = document.getElementById("remarks").value;

  try {
    let response;
    const vehicleData = {
      vehicleCode: currentVehicleId || `VEHICLE-${Date.now()}`,
      licensePlateNumber: licensePlate,
      vehicleCategory: category,
      fuelType: fuelType,
      status: status,
      staffId: assignedStaff || null,
      remarks: remarks,
    };

    if (currentVehicleId) {
      // Update existing vehicle
      response = await fetch(`http://localhost:8080/api/v1/vehicles/${currentVehicleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });
    } else {
      // Create new vehicle
      response = await fetch("http://localhost:8080/api/v1/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });
    }

    if (response.ok) {
      Swal.fire({
        title: "Success",
        text: `Vehicle ${currentVehicleId ? 'updated' : 'created'} successfully`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        fetchVehiclesFromBackend(); // Refresh the table
        bootstrap.Modal.getInstance(document.getElementById("vehicleModal")).hide(); // Close the modal
      });
    } else {
      throw new Error('Failed to save vehicle');
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    console.error("Error:", error);
  }
});

// Edit Vehicle
function editVehicle(id) {
  const vehicle = vehicles.find(v => v.id === id);
  if (vehicle) {
    document.getElementById("licensePlate").value = vehicle.licensePlate;
    document.getElementById("vehicleCategory").value = vehicle.category;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("status").value = vehicle.status;
    document.getElementById("assignedStaff").value = vehicle.assignedStaff || '';
    document.getElementById("remarks").value = vehicle.remarks || '';

    currentVehicleId = id;
    document.getElementById("vehicleModalLabel").textContent = "Edit Vehicle";
    bootstrap.Modal.getInstance(document.getElementById("vehicleModal")).show();
  } else {
    console.error("Vehicle with ID", id, "not found.");
  }
}

// Delete Vehicle
async function deleteVehicle(id) {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the vehicle permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        Swal.fire("Deleted", "Vehicle deleted successfully", "success");
        fetchVehiclesFromBackend(); // Refresh the vehicle list
      } else {
        throw new Error("Failed to delete vehicle");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      console.error("Error:", error);
    }
  }
}

// Reset form fields
function resetForm() {
  currentVehicleId = null;
  document.getElementById("vehicleForm").reset();
}

// Search Vehicles
document.getElementById("searchVehicle").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm) ||
    vehicle.category.toLowerCase().includes(searchTerm)
  );

  const vehicleTableBody = document.getElementById("vehicleTableBody");
  vehicleTableBody.innerHTML = ""; // Clear existing rows

  filteredVehicles.forEach(vehicle => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(vehicle);
    vehicleTableBody.appendChild(row);
  });
});
