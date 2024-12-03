document.addEventListener("DOMContentLoaded", initLogManagement);

let logList = []; // Stores all log data
let editingLogId = null; // Tracks the ID of the log being edited

function initLogManagement() {
  // Add event listener to the form
  document.getElementById("logForm").addEventListener("submit", saveLog);

  // Sample data (optional, for testing/demo)
  logList = [
    {
      code: "LOG-1001",
      date: "2024-01-01",
      observation: "Test observation",
      image: "image1.jpg",
      fields: ["Field 1", "Field 2"],
    },
    {
      code: "LOG-1002",
      date: "2024-02-01",
      observation: "Another observation",
      image: "image2.jpg",
      fields: ["Field 3"],
    },
  ];
  updateLogTable();
}

// Save or Update Log
function saveLog(event) {
  event.preventDefault();

  const code = editingLogId || `LOG-${Date.now()}`;
  const date = document.getElementById("logDate").value;
  const observation = document.getElementById("logDetails").value;
  const fields = Array.from(
    document.getElementById("fields").selectedOptions
  ).map((option) => option.value);

  // Handle image upload (this implementation assumes local image path for display)
  const imageFile = document.getElementById("observedImage").files[0];
  const image = imageFile ? URL.createObjectURL(imageFile) : null;

  if (editingLogId) {
    // Update existing log
    const log = logList.find((item) => item.code === editingLogId);
    log.date = date;
    log.observation = observation;
    log.fields = fields;
    log.image = image;
  } else {
    // Add new log
    logList.push({ code, date, observation, fields, image });
  }

  editingLogId = null; // Reset editing mode
  document.getElementById("logForm").reset(); // Clear form
  bootstrap.Modal.getInstance(document.getElementById("logModal")).hide(); // Hide modal
  updateLogTable(); // Refresh table
}

// Update Log Table
function updateLogTable() {
  const tableBody = document.getElementById("logTableBody");
  tableBody.innerHTML = ""; // Clear table

  logList.forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.code}</td>
      <td>${log.date}</td>
      <td>${log.observation}</td>
      <td><img src="${
        log.image
      }" alt="Observed" style="width: 50px; height: 50px;" /></td>
      <td>${log.fields.join(", ")}</td>
      <td>
        <button class="btn btn-sm " onclick="editLog('${log.code}')">
           <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm " onclick="deleteLog('${log.code}')">
          <i class="fa-solid fa-trash" style="color: #e9542f;"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Edit Log
function editLog(code) {
  editingLogId = code; // Set editing mode
  const log = logList.find((item) => item.code === code);

  if (log) {
    document.getElementById("logDate").value = log.date;
    document.getElementById("logDetails").value = log.observation;

    // Populate fields
    const fieldsSelect = document.getElementById("fields");
    Array.from(fieldsSelect.options).forEach((option) => {
      option.selected = log.fields.includes(option.value);
    });

    document.getElementById("logModalLabel").innerText = "Edit Log";
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("logModal")
    ).show(); // Show modal
  }
}

// Delete Log
function deleteLog(code) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this log?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      logList = logList.filter((item) => item.code !== code);
      updateLogTable();
      Swal.fire("Deleted!", "The log has been deleted.", "success");
    }
  });
}

// Search Log
function searchLog() {
  const query = document.getElementById("searchLog").value.toLowerCase();
  const rows = document.querySelectorAll("#logTableBody tr");

  rows.forEach((row) => {
    const code = row.querySelector("td:nth-child(1)").innerText.toLowerCase();
    const observation = row
      .querySelector("td:nth-child(3)")
      .innerText.toLowerCase();
    row.style.display =
      code.includes(query) || observation.includes(query) ? "" : "none";
  });
}
