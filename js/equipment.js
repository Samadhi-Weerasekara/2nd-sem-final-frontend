document.addEventListener("DOMContentLoaded", () => {
  initEquipmentManagement();
  fetchEquipmentFromBackend();
});

let equipmentList = []; // Stores all equipment data
let editingEquipmentId = null; // Tracks the ID of the equipment being edited

// Fetch equipment data from the backend
function fetchEquipmentFromBackend() {
  fetch("http://localhost:8080/api/v1/equipments/allEquipments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Response Status:", response.status);
        throw new Error("Failed to fetch equipment data");
      }
      return response.json();
    })
    .then((data) => {
      // Transform backend data to match frontend expectations
      equipmentList = data.map((equipment) => ({
        id: equipment.equipmentId, // Map equipmentId to id
        name: equipment.name,
        type: equipment.type,
        status: equipment.status,
        staff: equipment.staffIds ? equipment.staffIds.join(", ") : "N/A",
        field: equipment.fieldIds ? equipment.fieldIds.join(", ") : "N/A",
      }));

      updateEquipmentTable(); // Refresh the table
    })
    .catch((error) => {
      console.error("Error fetching equipment data:", error);
      Swal.fire(
        "Error",
        "Unable to fetch equipment data from the backend.",
        "error"
      );
    });
}

// Initialize equipment management UI
function initEquipmentManagement() {
  document
    .getElementById("equipmentForm")
    .addEventListener("submit", saveEquipment);

  document.getElementById("addEquipmentBtn").addEventListener("click", () => {
    editingEquipmentId = null; // Reset editing mode
    document.getElementById("equipmentForm").reset(); // Clear form fields
    currentVehicleId = null; // Reset the currentVehicleId after saving
    vehicleForm.reset(); // Reset the form
    vehicleModal.hide(); // Hide the modal

    document.getElementById("equipmentModalLabel").innerText = "Add Equipment"; // Set modal title
  });
}

// Save or Update Equipment
function saveEquipment(event) {
  event.preventDefault();

  const id = editingEquipmentId || `EQUIP-${Date.now()}`;
  const name = document.getElementById("equipmentName").value;
  const type = document.getElementById("equipmentType").value;
  const status = document.getElementById("status").value;
  const staff = document.getElementById("assignedStaff").value || "N/A";
  const field = document.getElementById("assignedField").value || "N/A";

  if (editingEquipmentId) {
    // Update existing equipment
    const equipment = equipmentList.find(
      (item) => item.id === editingEquipmentId
    );
    Object.assign(equipment, { name, type, status, staff, field });
  } else {
    // Add new equipment
    equipmentList.push({ id, name, type, status, staff, field });
  }

  editingEquipmentId = null; // Reset editing mode
  document.getElementById("equipmentForm").reset(); // Clear form
  bootstrap.Modal.getInstance(document.getElementById("equipmentModal")).hide(); // Hide modal
  updateEquipmentTable(); // Refresh table
}

// Update Equipment Table
function updateEquipmentTable() {
  const tableBody = document.getElementById("equipmentTableBody");
  tableBody.innerHTML = ""; // Clear table

  equipmentList.forEach((equipment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${equipment.id}</td>
      <td>${equipment.name}</td>
      <td>${equipment.type}</td>
      <td>${equipment.status}</td>
      <td>${equipment.staff}</td>
      <td>${equipment.field}</td>
      <td>
        <button class="btn btn-sm" onclick="editEquipment('${equipment.id}')">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm" onclick="deleteEquipment('${equipment.id}')">
          <i class="fa-solid fa-trash" style="color: #e9542f;"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Edit Equipment
function editEquipment(id) {
  document.getElementById("equipmentModalLabel").innerText = "Edit Equipment";
  editingEquipmentId = id;

  const equipment = equipmentList.find((item) => item.id === id);
  if (equipment) {
    document.getElementById("equipmentName").value = equipment.name;
    document.getElementById("equipmentType").value = equipment.type;
    document.getElementById("status").value = equipment.status;
    document.getElementById("assignedStaff").value = equipment.staff;
    document.getElementById("assignedField").value = equipment.field;

    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("equipmentModal")
    ).show();
  }
}

// Delete Equipment
function deleteEquipment(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this equipment?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      equipmentList = equipmentList.filter((item) => item.id !== id);
      updateEquipmentTable();
      Swal.fire("Deleted!", "The equipment has been deleted.", "success");
    }
  });
}

// Search Equipment
function searchEquipment() {
  const query = document.getElementById("searchEquipment").value.toLowerCase();
  const rows = document.querySelectorAll("#equipmentTableBody tr");

  rows.forEach((row) => {
    const id = row.querySelector("td:nth-child(1)").innerText.toLowerCase();
    const name = row.querySelector("td:nth-child(2)").innerText.toLowerCase();
    row.style.display =
      id.includes(query) || name.includes(query) ? "" : "none";
  });
}
