// Sample data to simulate staff records (in a real app, this would come from a database)
let staffList = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    designation: "Manager",
    gender: "Male",
    joinedDate: "2022-01-10",
    email: "john.doe@example.com",
    mobilePhone: "0712345678",
    address: "123 Main St, City, State, Postal Code",
    role: "Admin",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    designation: "Manager",
    gender: "Male",
    joinedDate: "2022-01-10",
    email: "john.doe@example.com",
    mobilePhone: "0712345678",
    address: "123 Main St, City, State, Postal Code",
    role: "Admin",
  },
  // Add more sample staff members as needed
];

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
    const staffIndex = staffList.findIndex((staff) => staff.id == staffId);
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
    // Add new staff
    const newStaff = {
      id: staffList.length + 1, // Simple ID generation
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
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${staff.id}</td>
            <td>${staff.firstName} ${staff.lastName}</td>
            <td>${staff.designation}</td>
            <td>${staff.gender}</td>
            <td>${staff.joinedDate}</td>
            <td>${staff.email}</td>
            <td>${staff.mobilePhone}</td>
            <td>${staff.address}</td>
            <td>
                <div class="btn btn-sm" onclick="editStaff(${staff.id})"><i class="fa-solid fa-pen"></i></div>
                <div class="btn  btn-sm" onclick="deleteStaff(${staff.id})"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></div>

            </td>
        `;
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
  staffList = staffList.filter((staff) => staff.id !== id);
  updateStaffTable();
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
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${staff.id}</td>
            <td>${staff.firstName} ${staff.lastName}</td>
            <td>${staff.designation}</td>
            <td>${staff.gender}</td>
            <td>${staff.joinedDate}</td>
            <td>${staff.email}</td>
            <td>${staff.mobilePhone}</td>
            <td>${staff.address}</td>
            <td>
                <button class="btn btn-info" onclick="editStaff(${staff.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteStaff(${staff.id})">Delete</button>
            </td>
        `;
    staffTableBody.appendChild(row);
  });
}

// Event listener for form submission
document.getElementById("staffForm").addEventListener("submit", saveStaff);

// Initial population of the staff table
updateStaffTable();
