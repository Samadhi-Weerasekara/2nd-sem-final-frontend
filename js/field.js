document.addEventListener("DOMContentLoaded", () => {
  fetchFieldsFromBackend();

  // Manage modal focus and background element tabindex
  $('#fieldModal').on('shown.bs.modal', function () {
    $(this).find('button, [href], input, select, textarea').first().focus();
    $('.background-elements').attr('tabindex', '-1');
  });

  $('#fieldModal').on('hidden.bs.modal', function () {
    $('.background-elements').removeAttr('tabindex');
    resetFieldForm();
  });
});

let editingFieldCode = null; // Track the field being edited
let fields = [];

// Fetch fields from the backend
async function fetchFieldsFromBackend() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    console.log("Token from localStorage:", token);

    const response = await axios.get("http://localhost:8080/api/v1/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("Data fetched from backend:", response.data);
    fields = [];
    fields.push(...response.data);
    populateFieldTable();
  } catch (error) {
    console.error("Error fetching field data:", error);
  }
}

// Populate the field table
function populateFieldTable() {
  const tableBody = document.getElementById("fieldTableBody");
  tableBody.innerHTML = "";

  fields.forEach((field) => {
    const row = document.createElement("tr");
    row.innerHTML = generateFieldRowHTML(
      field.fieldCode,
      field.fieldName,
      field.fieldLocation,
      field.extentSize,
      base64ToImage(field.fieldImage1),
      base64ToImage(field.fieldImage2)
    );
    tableBody.appendChild(row);
  });
}

// Generate Table Row HTML
function generateFieldRowHTML(fieldCode, name, location, extent, image1, image2) {
  return `
    <td>${fieldCode}</td>
    <td>${name}</td>
    <td>${location}</td>
    <td>${extent}</td>
    <td><img src="${image1}" alt="Field Image 1" style="width: 100px; height: auto;"></td>
    <td><img src="${image2}" alt="Field Image 2" style="width: 100px; height: auto;"></td>
    <td>
      <button class="btn btn-sm" onclick="editField('${fieldCode}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-sm" onclick="deleteField('${fieldCode}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
  `;
}

// Convert base64 image to HTML Image element
function base64ToImage(base64String) {
  return `data:image/jpeg;base64,${base64String}`;
}

// Add/Edit Field Form Submit
document.getElementById("fieldForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const fieldCode = editingFieldCode || `FIELD-${Date.now()}`;
  const fieldName = document.getElementById("fieldName").value;
  const fieldLocation = document.getElementById("fieldLocation").value;
  const fieldExtent = document.getElementById("fieldExtent").value;
  const fieldImage1 = document.getElementById("fieldImage1").files[0];
  const fieldImage2 = document.getElementById("fieldImage2").files[0];

  const formData = new FormData();
  formData.append("fieldName", fieldName);
  formData.append("fieldLocation", fieldLocation);
  formData.append("extentSize", fieldExtent);
  if (fieldImage1) formData.append("fieldImage1", fieldImage1);
  if (fieldImage2) formData.append("fieldImage2", fieldImage2);

  try {
    const token = localStorage.getItem("authToken");
    let response;

    if (editingFieldCode) {
      response = await axios.put(
        `http://localhost:8080/api/v1/fields/${editingFieldCode}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      response = await axios.post("http://localhost:8080/api/v1/fields", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }

    Swal.fire({
      title: "Success",
      text: editingFieldCode ? "Field updated successfully" : "Field created successfully",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      fetchFieldsFromBackend();
      bootstrap.Modal.getInstance(document.getElementById("fieldModal")).hide();
    });
  } catch (error) {
    Swal.fire("Error", "An error occurred while saving the field data", "error");
    console.error("Error:", error);
  }
});

// Edit Field
function editField(fieldCode) {
  const field = fields.find((item) => item.fieldCode === fieldCode);
  if (field) {
    document.getElementById("fieldName").value = field.fieldName;
    document.getElementById("fieldLocation").value = field.fieldLocation;
    document.getElementById("fieldExtent").value = field.extentSize;
    document.getElementById("previewImage1").src = base64ToImage(field.fieldImage1);
    document.getElementById("previewImage1").style.display = "block";
    document.getElementById("previewImage2").src = base64ToImage(field.fieldImage2);
    document.getElementById("previewImage2").style.display = "block";

    editingFieldCode = fieldCode;
    document.getElementById("fieldModalLabel").textContent = "Edit Field";
    const fieldModal = new bootstrap.Modal(document.getElementById("fieldModal"));
    fieldModal.show();
  } else {
    console.error("Field with code", fieldCode, "not found.");
  }
}

// Delete Field
async function deleteField(fieldCode) {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the field permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:8080/api/v1/fields/${fieldCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        Swal.fire("Deleted", "Field deleted successfully", "success");
        fetchFieldsFromBackend();
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while deleting the field", "error");
      console.error("Error:", error);
    }
  }
}

// Reset the form fields
function resetFieldForm() {
  editingFieldCode = null;
  document.getElementById("fieldForm").reset();
  document.getElementById("previewImage1").style.display = "none";
  document.getElementById("previewImage2").style.display = "none";
}

// Search Functionality
function searchField() {
  const query = document.getElementById("searchField").value.toLowerCase();
  const rows = document.querySelectorAll("#fieldTableBody tr");

  if (query.trim() === "") {
    // If the search bar is empty, show all rows
    rows.forEach((row) => {
      row.style.display = "";
    });
  } else {
    // Otherwise, filter rows based on the query
    rows.forEach((row) => {
      const fieldName = row
        .querySelector("td:nth-child(2)")
        .innerText.toLowerCase();
      row.style.display = fieldName.includes(query) ? "" : "none";
    });
  }
}

// function previewImage(inputId, previewId) {
//   const fileInput = document.getElementById(inputId);
//   const preview = document.getElementById(previewId);

//   if (fileInput.files && fileInput.files[0]) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       preview.src = e.target.result;
//       preview.style.display = "block";
//     };
//     reader.readAsDataURL(fileInput.files[0]);
//   }
// }
// // Function to update the field table
// function updateFieldTable(fields) {
//   const tableBody = document.getElementById("fieldTableBody");
//   tableBody.innerHTML = ""; // Clear existing rows

//   fields.forEach((field) => {
//     const row = document.createElement("tr");
//     row.setAttribute("data-id", field.fieldCode); // Use fieldCode as ID for the row
//     row.innerHTML = generateRowHTML(
//       field.fieldCode,
//       field.fieldName,
//       field.fieldLocation,
//       field.extentSize,
//       field.fieldImage1,
//       field.fieldImage2
//     );
//     tableBody.appendChild(row);
//   });
// }