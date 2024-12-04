document.addEventListener("DOMContentLoaded", () => {
  initValues(); // Call initValues function
  fetchFieldsFromBackend(); // Call fetchFieldsFromBackend function
});

let editingFieldId = null; // Track the field being edited
let fields = [];

function fetchFieldsFromBackend() {
  fetch("http://localhost:8080/api/v1/fields", {
    // Update the endpoint to match your API for fields
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch fields");
      }
      return response.json();
    })
    .then((data) => {
      const fields = data.map((field) => ({
        fieldCode: field.fieldCode,
        fieldName: field.fieldName.trim(), // Trimming extra spaces
        fieldLocation: field.fieldLocation, // Assuming this is a valid location format
        extentSize: field.extentSize,
        fieldImage1: field.fieldImage1, // Assuming it's a valid base64 string
        fieldImage2: field.fieldImage2, // Assuming it's a valid base64 string
      }));

      console.log(fields);
      console.log("Fields fetched successfully:", fields);

      // Call a function to update the UI or populate the table with fetched fields
      updateFieldTable(fields);
    })
    .catch((error) => {
      console.error("Error fetching fields:", error);
    });
}


function initValues() {
  const tableBody = document.getElementById("fieldTableBody");
  fields.forEach((field) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      field.fieldId,
      field.fieldName,
      field.fieldLocation,
      field.fieldExtent,
      field.fieldImage1,
      field.fieldImage2
    );
    tableBody.appendChild(row);
  });
}

// Add Event Listener to the Form
document.getElementById("fieldForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const fieldId = editingFieldId || Date.now(); // Use existing ID if editing
  const fieldName = document.getElementById("fieldName").value;
  const fieldLocation = document.getElementById("fieldLocation").value;
  const fieldExtent = document.getElementById("fieldExtent").value;

  // Get image data
  const fieldImage1 = document.getElementById("fieldImage1").files[0]
    ? document.getElementById("previewImage1").src
    : "";
  const fieldImage2 = document.getElementById("fieldImage2").files[0]
    ? document.getElementById("previewImage2").src
    : "";

  if (editingFieldId) {
    // Update existing row
    const row = document.querySelector(`tr[data-id="${fieldId}"]`);
    row.innerHTML = generateRowHTML(
      fieldId,
      fieldName,
      fieldLocation,
      fieldExtent,
      fieldImage1,
      fieldImage2
    );
  } else {
    // Add a new row
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", fieldId);
    newRow.innerHTML = generateRowHTML(
      fieldId,
      fieldName,
      fieldLocation,
      fieldExtent,
      fieldImage1,
      fieldImage2
    );
    document.getElementById("fieldTableBody").appendChild(newRow);
  }

  // Reset the form and close the modal
  document.getElementById("fieldForm").reset();
  document.getElementById("previewImage1").style.display = "none";
  document.getElementById("previewImage2").style.display = "none";
  editingFieldId = null;
  bootstrap.Modal.getInstance(document.getElementById("fieldModal")).hide();
});

// Generate Table Row HTML
function generateRowHTML(
  fieldId,
  fieldName,
  fieldLocation,
  fieldExtent,
  fieldImage1,
  fieldImage2
) {
  return `
    <td>${fieldId}</td>
    <td>${fieldName}</td>
    <td>${fieldLocation}</td>
    <td>${fieldExtent}</td>
    <td><img src="${fieldImage1}" alt="Image 1" style="width: 100px; height: auto;"></td>
    <td><img src="${fieldImage2}" alt="Image 2" style="width: 100px; height: auto;"></td>
    <td>
      <button class="btn  btn-sm" onclick="editField('${fieldId}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn  btn-sm" onclick="deleteField('${fieldId}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
  `;
}

function openAddFieldModal() {
  editingFieldId = null; // Clear editing mode
  document.getElementById("fieldForm").reset();
  document.getElementById("fieldModalLabel").innerText = "Add Field";

  // Reset image previews
  document.getElementById("previewImage1").style.display = "none";
  document.getElementById("previewImage2").style.display = "none";
}

function editField(fieldId) {
  editingFieldId = fieldId; // Set the editing ID
  const row = document.querySelector(`tr[data-id="${fieldId}"]`);
  const cells = row.querySelectorAll("td");

  // Populate the modal fields
  document.getElementById("fieldModalLabel").innerText = "Edit Field";
  document.getElementById("fieldName").value = cells[1].innerText; // Field Name
  document.getElementById("fieldLocation").value = cells[2].innerText; // Location
  document.getElementById("fieldExtent").value = cells[3].innerText; // Extent

  // Load existing image previews
  const image1 = cells[4].querySelector("img").src;
  const image2 = cells[5].querySelector("img").src;

  const previewImage1 = document.getElementById("previewImage1");
  const previewImage2 = document.getElementById("previewImage2");

  // Show previews for images
  if (image1) {
    previewImage1.src = image1;
    previewImage1.style.display = "block";
  } else {
    previewImage1.style.display = "none";
  }

  if (image2) {
    previewImage2.src = image2;
    previewImage2.style.display = "block";
  } else {
    previewImage2.style.display = "none";
  }

  // Clear file input fields (optional for new uploads)
  document.getElementById("fieldImage1").value = "";
  document.getElementById("fieldImage2").value = "";

  // Open the modal
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("fieldModal")
  ).show();
}

function deleteField(fieldId) {
  // Show SweetAlert confirmation dialog
  Swal.fire({
    title: "Are you sure?", // Confirmation title
    text: "Do you really want to delete this field?", // Confirmation message
    icon: "warning", // Warning icon
    showCancelButton: true, // Show "Cancel" button
    confirmButtonText: "Yes, delete it!", // Text for the confirmation button
    cancelButtonText: "Cancel", // Text for the cancel button
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove the row from the DOM
      const row = document.querySelector(`tr[data-id="${fieldId}"]`);
      if (row) {
        row.remove();
      }

      // Display success message
      Swal.fire("Deleted!", "The field has been deleted.", "success");
    }
  });
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

function previewImage(inputId, previewId) {
  const fileInput = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
}
// Function to update the field table
function updateFieldTable(fields) {
  const tableBody = document.getElementById("fieldTableBody");
  tableBody.innerHTML = ""; // Clear existing rows

  fields.forEach((field) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", field.fieldCode); // Use fieldCode as ID for the row
    row.innerHTML = generateRowHTML(
      field.fieldCode,
      field.fieldName,
      field.fieldLocation,
      field.extentSize,
      field.fieldImage1,
      field.fieldImage2
    );
    tableBody.appendChild(row);
  });
}