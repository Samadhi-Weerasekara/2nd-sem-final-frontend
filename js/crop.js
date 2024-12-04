document.addEventListener("DOMContentLoaded", () => {
  initValues();
  fetchCropsFromBackend();
});
let editingCropCode = null; // Track the crop being edited
let crops = [];

function fetchCropsFromBackend() {
  fetch("http://localhost:8080/api/v1/staff/allstaff", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }
      return response.json();
    })
    .then((data) => {
      const crops = data.map((crop) => ({
        cropCode: crop.cropCode,
        commonName: crop.commonName.trim(), // Trimming extra spaces
        scientificName: crop.scientificName.trim(), // Trimming extra spaces
        cropImage: crop.cropImage, // Assuming it's a valid base64 string
        category: crop.category,
        cropSeason: crop.cropSeason,
        fieldId: crop.fieldId,
      }));

      console.log(crops);
      console.log("Crops fetched successfully:", crops);

      // Call a function to update the UI or populate the table with fetched crops
      updateCropTable(crops);
    })
    .catch((error) => {
      console.error("Error fetching crops:", error);
    });
}

function initValues() {
  const tableBody = document.getElementById("cropTableBody");
  crops.forEach((crop) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      crop.cropCode,
      crop.cropCommonName,
      crop.cropScientificName,
      crop.cropCategory,
      crop.cropSeason,
      crop.cropField,
      crop.cropImage
    );
    tableBody.appendChild(row);
  });
}
// Add Event Listener to the Form
document.getElementById("cropForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const cropCode = editingCropCode || `CROP-${Date.now()}`; // Use existing code if editing, else generate a unique code
  const cropCommonName = document.getElementById("cropCommonName").value;
  const cropScientificName =
    document.getElementById("cropScientificName").value;
  const cropCategory = document.getElementById("cropCategory").value;
  const cropSeason = document.getElementById("cropSeason").value;
  const cropField = document.getElementById("cropField").value;

  // Get image data
  const cropImage = document.getElementById("cropImage").files[0]
    ? document.getElementById("previewCropImage").src
    : "";

  if (editingCropCode) {
    // Update existing row
    const row = document.querySelector(`tr[data-code="${cropCode}"]`);
    row.innerHTML = generateRowHTML(
      cropCode,
      cropCommonName,
      cropScientificName,
      cropCategory,
      cropSeason,
      cropField,
      cropImage
    );
  } else {
    // Add a new row
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-code", cropCode);
    newRow.innerHTML = generateRowHTML(
      cropCode,
      cropCommonName,
      cropScientificName,
      cropCategory,
      cropSeason,
      cropField,
      cropImage
    );
    document.getElementById("cropTableBody").appendChild(newRow);
  }

  // Reset the form and close the modal
  document.getElementById("cropForm").reset();
  document.getElementById("previewCropImage").style.display = "none";
  editingCropCode = null;
  bootstrap.Modal.getInstance(document.getElementById("cropModal")).hide();
});

// Generate Table Row HTML
function generateRowHTML(
  cropCode,
  commonName,
  scientificName,
  category,
  season,
  field,
  image
) {
  return `
    <td>${cropCode}</td>
    <td>${commonName}</td>
    <td>${scientificName}</td>
    <td>${category}</td>
    <td>${season}</td>
    <td>${field}</td>
    <td><img src="${image}" alt="Crop Image" style="width: 100px; height: auto;"></td>
    <td>
      <button class="btn  btn-sm" onclick="editCrop('${cropCode}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn  btn-sm" onclick="deleteCrop('${cropCode}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
  `;
}

// Open Add Crop Modal
function openAddCropModal() {
  editingCropCode = null; // Clear editing mode
  document.getElementById("cropForm").reset();
  document.getElementById("cropModalLabel").innerText = "Add Crop";

  // Reset image preview
  document.getElementById("previewCropImage").style.display = "none";
}

// Edit Crop
function editCrop(cropCode) {
  editingCropCode = cropCode; // Set the editing code
  const row = document.querySelector(`tr[data-code="${cropCode}"]`);
  const cells = row.querySelectorAll("td");

  // Populate the modal fields
  document.getElementById("cropModalLabel").innerText = "Edit Crop";
  document.getElementById("cropCommonName").value = cells[1].innerText; // Common Name
  document.getElementById("cropScientificName").value = cells[2].innerText; // Scientific Name
  document.getElementById("cropCategory").value = cells[3].innerText; // Category
  document.getElementById("cropSeason").value = cells[4].innerText; // Season
  document.getElementById("cropField").value = cells[5].innerText; // Field

  // Load existing image preview
  const image = cells[6].querySelector("img").src;
  const previewImage = document.getElementById("previewCropImage");

  if (image) {
    previewImage.src = image;
    previewImage.style.display = "block";
  } else {
    previewImage.style.display = "none";
  }

  // Clear file input (optional for new uploads)
  document.getElementById("cropImage").value = "";

  // Open the modal
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("cropModal")
  ).show();
}

function deleteCrop(cropCode) {
  Swal.fire({
    title: "Are you sure?", // Confirmation title
    text: "Do you really want to delete this crop?", // Confirmation message
    icon: "warning", // Warning icon
    showCancelButton: true, // Show "Cancel" button
    confirmButtonText: "Yes, delete it!", // Text for the confirmation button
    cancelButtonText: "Cancel", // Text for the cancel button
  }).then((result) => {
    if (result.isConfirmed) {
      // Correctly filter the crops array using cropCode
      crops = crops.filter((crop) => crop.cropCode !== cropCode);

      // Refresh the crop table
      updateCropTable();

      // Display success message
      Swal.fire("Deleted!", "The crop has been deleted.", "success");
    }
  });
}

// Function to refresh the crop table after deletion
function updateCropTable(crops) {
  const tableBody = document.getElementById("cropTableBody"); // Assuming a table body with this ID
  tableBody.innerHTML = ""; // Clear existing rows

  crops.forEach((crop) => {
    const row = document.createElement("tr");

    // Create and populate cells
    row.innerHTML = `
      <td>${crop.cropCode}</td>
      <td>${crop.commonName}</td>
      <td>${crop.scientificName}</td>
      <td><img src="data:image/png;base64,${crop.cropImage}" alt="${
      crop.commonName
    }" style="width: 50px; height: 50px;"></td>
      <td>${crop.category}</td>
      <td>${crop.cropSeason}</td>
      <td>${crop.fieldId ? crop.fieldId : "N/A"}</td>       <td>
      <button class="btn  btn-sm" onclick="editCrop('${cropCode}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn  btn-sm" onclick="deleteCrop('${cropCode}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
    `;

    tableBody.appendChild(row);
  });
}

// Search Functionality
function searchCrop() {
  const query = document.getElementById("searchCrop").value.toLowerCase();
  const rows = document.querySelectorAll("#cropTableBody tr");

  if (query.trim() === "") {
    // If the search bar is empty, show all rows
    rows.forEach((row) => {
      row.style.display = "";
    });
  } else {
    // Otherwise, filter rows based on the query
    rows.forEach((row) => {
      const commonName = row
        .querySelector("td:nth-child(2)")
        .innerText.toLowerCase();
      row.style.display = commonName.includes(query) ? "" : "none";
    });
  }
}

// Preview Image
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
