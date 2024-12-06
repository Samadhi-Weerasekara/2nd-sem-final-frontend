

function loadLogs() {
  $(document).ready(function () {
    loadLogs(); // Fetch logs when the document is ready
  });

  function loadLogs() {
    $.ajax({
      url: "http://localhost:8080/api/v1/logs",
      type: "GET",
      success: function (data) {
        console.log('Data from server:', data); // Log the data received from the backend
  
        // Populate the log table with data
        $("#logTableBody").empty(); // Clear existing rows
  
        data.forEach(function (log) {
          const fields = log.fieldId ? log.fieldId : "N/A"; // Update to use fieldId
          const crops = log.cropId ? log.cropId : "N/A"; // Update to use cropId
  
          $("#logTableBody").append(`
            <tr>
              <td>${log.logCode}</td>         <!-- Update logCode -->
              <td>${log.logDate}</td>         <!-- Update logDate -->
              <td>${log.logDetails}</td>      <!-- Update logDetails -->
              <td><img src="${log.observedImage}" alt="Observed" width="50" /></td>
              <td>${fields}</td>              <!-- Update fields -->
              <td>${crops}</td>               <!-- Update crops -->
              <td>${log.staffId}</td>         <!-- Update staffId -->
              <td>
                <button class="btn btn-sm" onclick="editCrop('${log.logCode}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm" onclick="deleteCrop('${log.logCode}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
              </td>
            </tr>
          `);
        });
      },
      error: function (xhr, status, error) {
        console.error("Failed to fetch logs:", error); // Log error details
        Swal.fire("Error!", "Failed to load logs: " + error, "error"); // Show error alert
      },
    });
  }
  
}
