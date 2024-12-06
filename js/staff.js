document.addEventListener("DOMContentLoaded", () => {
  fetchStaffFromBackend();

  // Manage modal focus and background element tabindex
  $('#staffModal').on('shown.bs.modal', function () {
    $(this).find('button, [href], input, select, textarea').first().focus();
    $('.background-elements').attr('tabindex', '-1');
  });

  $('#staffModal').on('hidden.bs.modal', function () {
    $('.background-elements').removeAttr('tabindex');
    resetForm();
  });
});

let editingStaffId = null; // Track the staff being edited
let staffList = [];

// Fetch staff from the backend
async function fetchStaffFromBackend() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await axios.get("http://localhost:8080/api/v1/staff/allstaff", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    staffList = response.data.map((staff) => ({
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      designation: staff.designation,
      gender: staff.gender,
      joinedDate: staff.joinedDate,
      dob: staff.dob,
      email: staff.email,
      contactNo: staff.contactNo,
      address: `${staff.address.line1}, ${staff.address.line2}, ${staff.address.line3}, ${staff.address.line4}, ${staff.address.line5}`,
      role: staff.role,
    }));

    initValues();
  } catch (error) {
    console.error("Error fetching staff data:", error);
  }
}

// Initialize table values
function initValues() {
  const tableBody = document.getElementById("staffTableBody");
  tableBody.innerHTML = "";

  staffList.forEach((staff) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      staff.id,
      `${staff.firstName} ${staff.lastName}`,
      staff.designation,
      staff.gender,
      staff.joinedDate,
      staff.dob,
      staff.email,
      staff.contactNo,
      staff.address,
      staff.role
    );
    tableBody.appendChild(row);
  });
}

// Generate Table Row HTML
function generateRowHTML(id, name, designation, gender, joinedDate, dob, email, contactNo, address, role) {
  return `
    <td>${id}</td>
    <td>${name}</td>
    <td>${designation}</td>
    <td>${gender}</td>
    <td>${joinedDate}</td>
    <td>${dob}</td>
    <td>${email}</td>
    <td>${contactNo}</td>
    <td>${address}</td>
    <td>${role}</td>
    <td>
      <button class="btn btn-sm" onclick="editStaff('${id}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-sm" onclick="deleteStaff('${id}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
  `;
}

// Add/Edit Staff Form Submit
document.getElementById("staffForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const staffId = editingStaffId || `STAFF-${Date.now()}`;
  const staffData = {
    id: staffId,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    designation: document.getElementById("designation").value,
    gender: document.getElementById("gender").value,
    joinedDate: document.getElementById("joinedDate").value,
    dob: document.getElementById("dob").value,
    email: document.getElementById("email").value,
    contactNo: document.getElementById("contactNo").value,
    address: {
      line1: document.getElementById("addressLine1").value,
      line2: document.getElementById("addressLine2").value,
      line3: document.getElementById("addressLine3").value,
      line4: document.getElementById("addressLine4").value,
      line5: document.getElementById("addressLine5").value,
    },
    role: document.getElementById("role").value,
  };

  try {
    const token = localStorage.getItem("authToken");
    let response;

    if (editingStaffId) {
      // Update existing staff
      response = await axios.put(
        `http://localhost:8080/api/v1/staff/${editingStaffId}`,
        staffData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      // Create new staff
      response = await axios.post("http://localhost:8080/api/v1/staff", staffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    Swal.fire("Success", "Staff data saved successfully", "success").then(() => {
      fetchStaffFromBackend();
      bootstrap.Modal.getInstance(document.getElementById("staffModal")).hide();
    });
  } catch (error) {
    Swal.fire("Error", "An error occurred while saving staff data", "error");
    console.error("Error:", error);
  }
});

// Edit Staff
function editStaff(id) {
  const staff = staffList.find((item) => item.id === id);
  if (staff) {
    document.getElementById("firstName").value = staff.firstName;
    document.getElementById("lastName").value = staff.lastName;
    document.getElementById("designation").value = staff.designation;
    document.getElementById("gender").value = staff.gender;
    document.getElementById("joinedDate").value = staff.joinedDate;
    document.getElementById("dob").value = staff.dob;
    document.getElementById("email").value = staff.email;
    document.getElementById("contactNo").value = staff.contactNo;

    const addressParts = staff.address.split(", ");
    document.getElementById("addressLine1").value = addressParts[0] || "";
    document.getElementById("addressLine2").value = addressParts[1] || "";
    document.getElementById("addressLine3").value = addressParts[2] || "";
    document.getElementById("addressLine4").value = addressParts[3] || "";
    document.getElementById("addressLine5").value = addressParts[4] || "";

    document.getElementById("role").value = staff.role;

    editingStaffId = id;
    document.getElementById("staffModalLabel").textContent = "Edit Staff";
    const staffModal = new bootstrap.Modal(document.getElementById("staffModal"));
    staffModal.show();
  }
}

// Delete Staff
async function deleteStaff(id) {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the staff permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:8080/api/v1/staff/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        Swal.fire("Deleted", "Staff deleted successfully", "success");
        fetchStaffFromBackend();
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while deleting the staff", "error");
      console.error("Error:", error);
    }
  }
}

// Reset the form fields and editingStaffId
function resetForm() {
  editingStaffId = null;
  document.getElementById("staffForm").reset();
}

// Search Staff
function searchStaff() {
  const searchTerm = document.getElementById("searchStaff").value.toLowerCase();
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.firstName.toLowerCase().includes(searchTerm) ||
      staff.lastName.toLowerCase().includes(searchTerm)
  );

  const tableBody = document.getElementById("staffTableBody");
  tableBody.innerHTML = ""; // Clear the table
  filteredStaff.forEach((staff) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      staff.id,
      `${staff.firstName} ${staff.lastName}`,
      staff.designation,
      staff.gender,
      staff.joinedDate,
      staff.dob,
      staff.email,
      staff.contactNo,
      staff.address,
      staff.role
    );
    tableBody.appendChild(row);
  });
}
