document.addEventListener("DOMContentLoaded", () => {
  fetchCropsFromBackend();

  // Manage modal focus and background element tabindex
  $('#cropModal').on('shown.bs.modal', function () {
    $(this).find('button, [href], input, select, textarea').first().focus();
    $('.background-elements').attr('tabindex', '-1');
  });

  $('#cropModal').on('hidden.bs.modal', function () {
    $('.background-elements').removeAttr('tabindex');
    resetForm();
  });
});

let editingCropCode = null; // Track the crop being edited
let crops = [];

// Fetch crops from the backend
async function fetchCropsFromBackend() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }
    console.log("Token from localStorage:", token);

    const response = await axios.get("http://localhost:8080/api/v1/crops", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("Data fetched from backend:", response.data);
    crops = [];
    crops.push(...response.data);
    initValues();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Initialize table values
function initValues() {
  const tableBody = document.getElementById("cropTableBody");
  tableBody.innerHTML = "";

  crops.forEach((crop) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      crop.cropCode,
      crop.commonName,
      crop.scientificName,
      crop.category,
      crop.cropSeason,
      crop.fieldId,
      base64ToImage(crop.cropImage)
    );
    tableBody.appendChild(row);
  });
}

// Generate Table Row HTML
function generateRowHTML(cropCode, commonName, scientificName, category, season, field, image) {
  return `
    <td>${cropCode}</td>
    <td>${commonName}</td>
    <td>${scientificName}</td>
    <td>${category}</td>
    <td>${season}</td>
    <td>${field}</td>
    <td><img src="${image}" alt="Crop Image" style="width: 100px; height: auto;"></td>
    <td>
      <button class="btn btn-sm" onclick="editCrop('${cropCode}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-sm" onclick="deleteCrop('${cropCode}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
  `;
}

// Convert base64 image to HTML Image element
function base64ToImage(base64String) {
  return `data:image/jpeg;base64,${base64String}`;
}

// Add/Edit Crop Form Submit
document.getElementById("cropForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const cropCode = editingCropCode || `CROP-${Date.now()}`;
  const cropCommonName = document.getElementById("cropCommonName").value;
  const cropScientificName = document.getElementById("cropScientificName").value;
  const cropCategory = document.getElementById("cropCategory").value;
  const cropSeason = document.getElementById("cropSeason").value;
  const cropField = document.getElementById("cropField").value;
  const cropImage = document.getElementById("cropImage").files[0];

  const formData = new FormData();
  formData.append("commonName", cropCommonName);
  formData.append("scientificName", cropScientificName);
  if (cropImage) formData.append("cropImage", cropImage); // Only append if there's an image
  formData.append("category", cropCategory);
  formData.append("cropSeason", cropSeason);

  try {
    const token = localStorage.getItem("authToken");
    let response;

    if (editingCropCode) {
      // Update existing crop
      response = await axios.put(
        `http://localhost:8080/api/v1/crops/${editingCropCode}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      // Create new crop
      response = await axios.post("http://localhost:8080/api/v1/crops", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }

    // Handle response based on the operation
    if (response.status === 201) {
      // Success on create
      Swal.fire({
        title: "Success",
        text: "Crop created successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        fetchCropsFromBackend(); // Refresh the table
        bootstrap.Modal.getInstance(document.getElementById("cropModal")).hide(); // Close the modal
      });
    } else if (response.status === 204) {
      // Success on update
      Swal.fire({
        title: "Success",
        text: "Crop updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        fetchCropsFromBackend(); // Refresh the table
        bootstrap.Modal.getInstance(document.getElementById("cropModal")).hide(); // Close the modal
      });
    }
  } catch (error) {
    Swal.fire("Error", "An error occurred while saving the crop data", "error");
    console.error("Error:", error);
  }
});

// Edit Crop
function editCrop(cropCode) {
  const crop = crops.find((item) => item.cropCode === cropCode);
  if (crop) {
    document.getElementById("cropCommonName").value = crop.commonName;
    document.getElementById("cropScientificName").value = crop.scientificName;
    document.getElementById("cropCategory").value = crop.category;
    document.getElementById("cropSeason").value = crop.cropSeason;
    document.getElementById("cropField").value = crop.fieldId;
    document.getElementById("previewCropImage").style.display = "block";
    document.getElementById("previewCropImage").src = base64ToImage(crop.cropImage);

    editingCropCode = cropCode;
    document.getElementById("cropModalLabel").textContent = "Edit Crop";
    const cropModal = new bootstrap.Modal(document.getElementById("cropModal"));
    cropModal.show();
  } else {
    console.error("Crop with code", cropCode, "not found.");
  }
}

// Delete Crop
async function deleteCrop(cropCode) {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the crop permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:8080/api/v1/crops/${cropCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        Swal.fire("Deleted", "Crop deleted successfully", "success");
        fetchCropsFromBackend();
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while deleting the crop", "error");
      console.error("Error:", error);
    }
  }
}

// Image Preview Before Upload
document.getElementById("cropImage").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("previewCropImage").src = reader.result;
      document.getElementById("previewCropImage").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Reset the form fields and editingCropCode
function resetForm() {
  editingCropCode = null;
  document.getElementById("cropForm").reset();
  document.getElementById("previewCropImage").style.display = "none"; // Hide the preview
}

// Search Functionality
function searchCrop() {
  const searchTerm = document.getElementById("searchCrop").value.toLowerCase();
  const filteredCrops = crops.filter(
    (crop) =>
      crop.commonName.toLowerCase().includes(searchTerm) ||
      crop.scientificName.toLowerCase().includes(searchTerm)
  );

  const tableBody = document.getElementById("cropTableBody");
  tableBody.innerHTML = ""; // Clear the table
  filteredCrops.forEach((crop) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      crop.cropCode,
      crop.commonName,
      crop.scientificName,
      crop.category,
      crop.cropSeason,
      crop.fieldId,
      base64ToImage(crop.cropImage)
    );
    tableBody.appendChild(row);
  });
}
