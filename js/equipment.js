document.addEventListener("DOMContentLoaded", () => {
  fetchEquipmentFromBackend();

  // Manage modal focus and background element tabindex
  $('#equipmentModal').on('shown.bs.modal', function () {
    $(this).find('button, [href], input, select, textarea').first().focus();
    $('.background-elements').attr('tabindex', '-1');
  });

  $('#equipmentModal').on('hidden.bs.modal', function () {
    $('.background-elements').removeAttr('tabindex');
    resetForm();
  });
});

let editingEquipmentId = null; // Track the equipment being edited
let equipmentList = [];

// Fetch equipment data from the backend
async function fetchEquipmentFromBackend() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    console.log("Token from localStorage:", token);
    const response = await axios.get("http://localhost:8080/api/v1/equipments/allEquipments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    equipmentList = response.data;
    initValues();
  } catch (error) {
    console.error("Error fetching equipment data:", error);
  }
}

// Initialize table values
function initValues() {
  const tableBody = document.getElementById("equipmentTableBody");
  tableBody.innerHTML = "";

  equipmentList.forEach((equipment) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      equipment.equipmentId,
      equipment.name,
      equipment.type,
      equipment.status,
      equipment.staffIds || "N/A",
      equipment.fieldIds || "N/A"
    );
    tableBody.appendChild(row);
  });
}

// Generate Table Row HTML
function generateRowHTML(id, name, type, status, staff, field) {
  return `
    <td>${id}</td>
    <td>${name}</td>
    <td>${type}</td>
    <td>${status}</td>
    <td>${staff}</td>
    <td>${field}</td>
    <td>
      <button class="btn btn-sm" onclick="editEquipment('${id}')">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button class="btn btn-sm" onclick="deleteEquipment('${id}')">
        <i class="fa-solid fa-trash" style="color: #e9542f;"></i>
      </button>
    </td>
  `;
}

// Add/Edit Equipment Form Submit
document.getElementById("equipmentForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const equipmentId = editingEquipmentId || `EQUIPMENT-${Date.now()}`;
  const name = document.getElementById("equipmentName").value;
  const type = document.getElementById("equipmentType").value;
  const status = document.getElementById("status").value;
  const staff = document.getElementById("assignedStaff").value;
  const field = document.getElementById("assignedField").value;

  const payload = {
    equipmentId,
    name,
    type,
    status,
    fieldIds: field || null,
    staffIds: staff || null
  };

  try {
    const token = localStorage.getItem("authToken");
    let response;

    if (editingEquipmentId) {
      // Update existing equipment
      response = await axios.put(
        `http://localhost:8080/api/v1/equipments/${editingEquipmentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      // Create new equipment
      response = await axios.post("http://localhost:8080/api/v1/equipments", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (response.status === 201 || response.status === 204) {
      Swal.fire("Success", "Equipment saved successfully", "success").then(() => {
        fetchEquipmentFromBackend();
        bootstrap.Modal.getInstance(document.getElementById("equipmentModal")).hide();
      });
    }
  } catch (error) {
    Swal.fire("Error", "An error occurred while saving the equipment data", "error");
    console.error("Error:", error);
  }
});

// Edit Equipment
function editEquipment(equipmentId) {
  const equipment = equipmentList.find((item) => item.equipmentId === equipmentId);
  if (equipment) {
    document.getElementById("equipmentName").value = equipment.name;
    document.getElementById("equipmentType").value = equipment.type;
    document.getElementById("status").value = equipment.status;
    document.getElementById("assignedStaff").value = equipment.staffIds || "";
    document.getElementById("assignedField").value = equipment.fieldIds || "";

    editingEquipmentId = equipmentId;
    document.getElementById("equipmentModalLabel").textContent = "Edit Equipment";
    const equipmentModal = new bootstrap.Modal(document.getElementById("equipmentModal"));
    equipmentModal.show();
  } else {
    console.error("Equipment with ID", equipmentId, "not found.");
  }
}

// Delete Equipment
async function deleteEquipment(equipmentId) {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the equipment permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:8080/api/v1/equipments/${equipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        Swal.fire("Deleted", "Equipment deleted successfully", "success");
        fetchEquipmentFromBackend();
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while deleting the equipment", "error");
      console.error("Error:", error);
    }
  }
}

// Reset the form fields and editingEquipmentId
function resetForm() {
  editingEquipmentId = null;
  document.getElementById("equipmentForm").reset();
}

// Search Functionality
function searchEquipment() {
  const searchTerm = document.getElementById("searchEquipment").value.toLowerCase();
  const filteredEquipment = equipmentList.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(searchTerm) ||
      equipment.equipmentId.toLowerCase().includes(searchTerm)
  );

  const tableBody = document.getElementById("equipmentTableBody");
  tableBody.innerHTML = "";
  filteredEquipment.forEach((equipment) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      equipment.equipmentId,
      equipment.name,
      equipment.type,
      equipment.status,
      equipment.staffIds || "N/A",
      equipment.fieldIds || "N/A"
    );
    tableBody.appendChild(row);
  });
}
