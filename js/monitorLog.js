document.addEventListener("DOMContentLoaded", () => {
  fetchLogsFromBackend();

  // Manage modal focus and background element tabindex
  $('#logModal').on('shown.bs.modal', function () {
    $(this).find('button, [href], input, select, textarea').first().focus();
    $('.background-elements').attr('tabindex', '-1');
  });

  $('#logModal').on('hidden.bs.modal', function () {
    $('.background-elements').removeAttr('tabindex');
    resetForm();
  });
});

let editingLogCode = null; // Track the log being edited
let logs = [];

// Fetch logs from the backend
async function fetchLogsFromBackend() {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/logs");
    console.log("Data fetched from backend:", response.data);
    logs = response.data;
    initValues();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Initialize table values
function initValues() {
  const tableBody = document.getElementById("logTableBody");
  tableBody.innerHTML = "";

  logs.forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      log.logCode,
      log.logDate,
      log.logDetails,
      base64ToImage(log.observedImage),
      log.fieldId || "N/A",
      log.cropId || "N/A",
      log.staffId
    );
    tableBody.appendChild(row);
  });
}

// Generate Table Row HTML
function generateRowHTML(logCode, logDate, logDetails, image, field, crop, staff) {
  return `
    <td>${logCode}</td>
    <td>${logDate}</td>
    <td>${logDetails}</td>
    <td><img src="${image}" alt="Log Image" style="width: 100px; height: auto;"></td>
    <td>${field}</td>
    <td>${crop}</td>
    <td>${staff}</td>
    <td>
      <button class="btn btn-sm" onclick="editLog('${logCode}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-sm" onclick="deleteLog('${logCode}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
    </td>
  `;
}

// Convert base64 image to HTML Image element
function base64ToImage(base64String) {
  return `data:image/jpeg;base64,${base64String}`;
}

// Add/Edit Log Form Submit
document.getElementById("logForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const logCode = editingLogCode || `LOG-${Date.now()}`;
  const logDate = document.getElementById("logDate").value;
  const logDetails = document.getElementById("logDetails").value;
  const observedImage = document.getElementById("logImage").files[0];
  const fieldId = document.getElementById("fieldId").value;
  const cropId = document.getElementById("cropId").value;
  const staffId = document.getElementById("staffId").value;

  const formData = new FormData();
  formData.append("logDate", logDate);
  formData.append("logDetails", logDetails);
  if (observedImage) formData.append("observedImage", observedImage);
  formData.append("fieldId", fieldId);
  formData.append("cropId", cropId);
  formData.append("staffId", staffId);

  try {
    let response;

    if (editingLogCode) {
      // Update existing log
      response = await axios.put(
        `http://localhost:8080/api/v1/logs/${editingLogCode}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      // Create new log
      response = await axios.post("http://localhost:8080/api/v1/logs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    // Handle response based on the operation
    if (response.status === 201) {
      Swal.fire({
        title: "Success",
        text: "Log created successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        fetchLogsFromBackend(); // Refresh the table
        bootstrap.Modal.getInstance(document.getElementById("logModal")).hide(); // Close the modal
      });
    } else if (response.status === 204) {
      // Success on update
      Swal.fire({
        title: "Success",
        text: "Log updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        fetchLogsFromBackend(); // Refresh the table
        bootstrap.Modal.getInstance(document.getElementById("logModal")).hide(); // Close the modal
      });
    }
  } catch (error) {
    Swal.fire("Error", "An error occurred while saving the log data", "error");
    console.error("Error:", error);
  }
});

// Edit Log
function editLog(logCode) {
  const log = logs.find((item) => item.logCode === logCode);
  if (log) {
    document.getElementById("logDate").value = log.logDate;
    document.getElementById("logDetails").value = log.logDetails;
    document.getElementById("fieldId").value = log.fieldId || "";
    document.getElementById("cropId").value = log.cropId || "";
    document.getElementById("staffId").value = log.staffId;

    if (log.observedImage) {
      document.getElementById("previewLogImage").style.display = "block";
      document.getElementById("previewLogImage").src = base64ToImage(log.observedImage);
    } else {
      document.getElementById("previewLogImage").style.display = "none";
    }

    editingLogCode = logCode;
    document.getElementById("logModalLabel").textContent = "Edit Log";
    const logModal = new bootstrap.Modal(document.getElementById("logModal"));
    logModal.show();
  } else {
    console.error("Log with code", logCode, "not found.");
  }
}

// Delete Log
async function deleteLog(logCode) {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the log permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/logs/${logCode}`);
      if (response.status === 204) {
        Swal.fire("Deleted", "Log deleted successfully", "success");
        fetchLogsFromBackend();
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while deleting the log", "error");
      console.error("Error:", error);
    }
  }
}

// Image Preview Before Upload
document.getElementById("logImage").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("previewLogImage").src = reader.result;
      document.getElementById("previewLogImage").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Reset the form fields and editingLogCode
function resetForm() {
  editingLogCode = null;
  document.getElementById("logForm").reset();
  document.getElementById("previewLogImage").style.display = "none"; // Hide the preview
}

// Search Functionality (optional)
function searchLog() {
  const searchTerm = document.getElementById("searchLog").value.toLowerCase();
  const filteredLogs = logs.filter(
    (log) =>
      log.logDetails.toLowerCase().includes(searchTerm) ||
      log.logCode.toLowerCase().includes(searchTerm)
  );

  const tableBody = document.getElementById("logTableBody");
  tableBody.innerHTML = ""; // Clear the table
  filteredLogs.forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      log.logCode,
      log.logDate,
      log.logDetails,
      base64ToImage(log.observedImage),
      log.fieldId || "N/A",
      log.cropId || "N/A",
      log.staffId
    );
    tableBody.appendChild(row);
  });
}
