document.addEventListener("DOMContentLoaded", () => {
  fetchStaffFromBackend();
});

// Sample data to simulate staff records (in a real app, this would come from a database)
let staffList = [];

// Fetch staff data from the backend
function fetchStaffFromBackend() {
  fetch("http://localhost:8080/api/v1/staff/allstaff", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch staff data");
      }
      return response.json();
    })
    .then((data) => {
      // Process the data and populate staffList
      staffList = data.map((staff) => ({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        designation: staff.designation,
        gender: staff.gender,
        joinedDate: staff.joinedDate,
        email: staff.email,
        mobilePhone: staff.contactNo,
        address: `${staff.address.line1}, ${staff.address.line2}, ${staff.address.line3}, ${staff.address.line4}, ${staff.address.line5}`,
        role: staff.role,
      }));

      // Update the staff table with the fetched data
      updateStaffTable();
    })
    .catch((error) => {
      console.error("Error fetching staff data:", error);
    });
}

// Function to generate HTML for a staff row
function generateRowHTML(id, firstName, lastName, designation, gender, joinedDate, email, mobilePhone, address, role) {
  return `
    <td>${id}</td>
    <td>${firstName} ${lastName}</td>
    <td>${designation}</td>
    <td>${gender}</td>
    <td>${joinedDate}</td>
    <td>${email}</td>
    <td>${mobilePhone}</td>
    <td>${address}</td>
    <td>
        <div class="btn btn-sm" onclick="editStaff('${id}')"><i class="fa-solid fa-pen"></i></div>
        <div class="btn btn-sm" onclick="deleteStaff('${id}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></div>
    </td>
  `;
}

// Function to open the modal and reset the form for adding staff
function openAddStaffModal() {
  document.getElementById("staffForm").reset();
  document.getElementById("staffId").value = ""; // Clear staff ID for new entry
  document.getElementById("staffModalLabel").innerText = "Add Staff"; // Change modal title
  new bootstrap.Modal(document.getElementById("staffModal")).show(); // Show the modal
}

// Function to save staff data (add or edit)
function saveStaff(event) {
  event.preventDefault(); // Prevent form submission

  const staffId = document.getElementById("staffId").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const designation = document.getElementById("designation").value;
  const gender = document.getElementById("gender").value;
  const joinedDate = document.getElementById("joinedDate").value;
  const email = document.getElementById("email").value;
  const mobilePhone = document.getElementById("mobilePhone").value;
  const addressLine1 = document.getElementById("addressLine1").value;
  const addressLine2 = document.getElementById("addressLine2").value;
  const addressLine3 = document.getElementById("addressLine3").value;
  const addressLine4 = document.getElementById("addressLine4").value;
  const addressLine5 = document.getElementById("addressLine5").value;

  const fullAddress = `${addressLine1}, ${addressLine2}, ${addressLine3}, ${addressLine4}, ${addressLine5}`;

  if (staffId) {
    // Edit existing staff
    const staffIndex = staffList.findIndex((staff) => staff.id === staffId);
    if (staffIndex > -1) {
      staffList[staffIndex] = {
        id: staffId,
        firstName,
        lastName,
        designation,
        gender,
        joinedDate,
        email,
        mobilePhone,
        address: fullAddress,
        role: document.getElementById("role").value,
      };
    }
  } else {
    // Add new staff (backend should provide an ID for new entries)
    const newStaff = {
      id: staffList.length + 1, // Placeholder until backend responds
      firstName,
      lastName,
      designation,
      gender,
      joinedDate,
      email,
      mobilePhone,
      address: fullAddress,
      role: document.getElementById("role").value,
    };
    staffList.push(newStaff);
  }

  // Update the table and close the modal
  updateStaffTable();
  new bootstrap.Modal(document.getElementById("staffModal")).hide();
}

// Function to update the staff table with the current staffList
function updateStaffTable() {
  const staffTableBody = document.getElementById("staffTableBody");
  staffTableBody.innerHTML = ""; // Clear existing rows

  staffList.forEach((staff) => {
    const rowHTML = generateRowHTML(
      staff.id,
      staff.firstName,
      staff.lastName,
      staff.designation,
      staff.gender,
      staff.joinedDate,
      staff.email,
      staff.mobilePhone,
      staff.address,
      staff.role
    );
    const row = document.createElement("tr");
    row.innerHTML = rowHTML;
    staffTableBody.appendChild(row);
  });
}

// Function to edit a staff member
function editStaff(id) {
  const staff = staffList.find((staff) => staff.id === id);
  if (staff) {
    document.getElementById("staffId").value = staff.id;
    document.getElementById("firstName").value = staff.firstName;
    document.getElementById("lastName").value = staff.lastName;
    document.getElementById("designation").value = staff.designation;
    document.getElementById("gender").value = staff.gender;
    document.getElementById("joinedDate").value = staff.joinedDate;
    document.getElementById("email").value = staff.email;
    document.getElementById("mobilePhone").value = staff.mobilePhone;

    const addressParts = staff.address.split(", ");
    document.getElementById("addressLine1").value = addressParts[0] || "";
    document.getElementById("addressLine2").value = addressParts[1] || "";
    document.getElementById("addressLine3").value = addressParts[2] || "";
    document.getElementById("addressLine4").value = addressParts[3] || "";
    document.getElementById("addressLine5").value = addressParts[4] || "";

    document.getElementById("staffModalLabel").innerText = "Edit Staff"; // Change modal title
    openAddStaffModal(); // Open the modal
  }
}

// Function to delete a staff member
function deleteStaff(id) {
  // Show SweetAlert confirmation dialog
  Swal.fire({
    title: "Are you sure?", // Confirmation title
    text: "Do you really want to delete this staff?", // Confirmation message
    icon: "warning", // Warning icon
    showCancelButton: true, // Show "Cancel" button
    confirmButtonText: "Yes, delete it!", // Text for the confirmation button
    cancelButtonText: "Cancel", // Text for the cancel button
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove staff member from the list
      staffList = staffList.filter((staff) => staff.id !== id);

      // Update the staff table
      updateStaffTable();

      // Display success message
      Swal.fire("Deleted!", "The staff has been deleted.", "success");
    }
  });
}

// Function to search for staff by name
function searchStaff() {
  const query = document.getElementById("searchStaff").value.toLowerCase();
  const filteredStaff = staffList.filter((staff) => {
    return `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(query);
  });

  // Update the table with filtered results
  const staffTableBody = document.getElementById("staffTableBody");
  staffTableBody.innerHTML = ""; // Clear existing rows

  filteredStaff.forEach((staff) => {
    const rowHTML = generateRowHTML(
      staff.id,
      staff.firstName,
      staff.lastName,
      staff.designation,
      staff.gender,
      staff.joinedDate,
      staff.email,
      staff.mobilePhone,
      staff.address,
      staff.role
    );
    const row = document.createElement("tr");
    row.innerHTML = rowHTML;
    staffTableBody.appendChild(row);
  });
}

// Event listener for form submission
document.getElementById("staffForm").addEventListener("submit", saveStaff);

// Initial population of the staff table
// No longer needed since the table is updated after fetching data
// updateStaffTable();
