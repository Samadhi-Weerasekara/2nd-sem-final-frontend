document.addEventListener("DOMContentLoaded", initEquipmentManagement);

let equipmentList = []; // Stores all equipment data
let editingEquipmentId = null; // Tracks the ID of the equipment being edited

function initEquipmentManagement() {
  // Add event listener to the form
  document
    .getElementById("equipmentForm")
    .addEventListener("submit", saveEquipment);

  // Prepopulate table (optional, for testing/demo)
  equipmentList = [
    {
      id: "EQUIP-1001",
      name: "Tractor",
      type: "Mechanical",
      status: "Available",
      staff: "John Doe",
      field: "Field A",
    },
    {
      id: "EQUIP-1002",
      name: "Irrigation Pump",
      type: "Electrical",
      status: "Unavailable",
      staff: "N/A",
      field: "Field B",
    },
  ];
  updateEquipmentTable();
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
    equipment.name = name;
    equipment.type = type;
    equipment.status = status;
    equipment.staff = staff;
    equipment.field = field;
  } else {
    // Add new equipment
    equipmentList.push({ id, name, type, status, staff, field });
  }

  editingEquipmentId = null; // Reset editing mode
  document.getElementById("equipmentForm").reset();
  bootstrap.Modal.getInstance(document.getElementById("equipmentModal")).hide();
  updateEquipmentTable();
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
        <button class="btn btn-sm " onclick="editEquipment('${equipment.id}')">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm " onclick="deleteEquipment('${equipment.id}')">
          <i class="fa-solid fa-trash" style="color: #e9542f;"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Edit Equipment
function editEquipment(id) {
  editingEquipmentId = id; // Set editing mode
  const equipment = equipmentList.find((item) => item.id === id);

  document.getElementById("equipmentName").value = equipment.name;
  document.getElementById("equipmentType").value = equipment.type;
  document.getElementById("status").value = equipment.status;
  document.getElementById("assignedStaff").value = equipment.staff;
  document.getElementById("assignedField").value = equipment.field;

  document.getElementById("equipmentModalLabel").innerText = "Edit Equipment";
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("equipmentModal")
  ).show();
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
