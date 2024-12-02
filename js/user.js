document.addEventListener("DOMContentLoaded", () => {
    const addUserForm = document.getElementById("addUserForm");
    const userSection = document.querySelector(".user-section");
  
    // Handle Add New User Form Submission
    addUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // Get form input values
      const name = document.getElementById("newName").value;
      const email = document.getElementById("newEmail").value;
      const role = document.getElementById("newRole").value;
      const username = document.getElementById("newUsername").value;
      const password = document.getElementById("newPassword").value;
  
      // Create a new user card
      const newUserCard = document.createElement("div");
      newUserCard.classList.add("col-md-4");
      newUserCard.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <img src="/assests/png-transparent-businessperson-manager-organise-image-file-formats-sticker-necktie-thumbnail-removebg-preview.png" alt="Avatar" class="rounded-circle me-3" width="50">
              <div>
                <h5 class="card-title mb-0">${name}</h5>
                <p class="text-muted small">${email}</p>
                <p class="badge bg-primary">${role}</p>
              </div>
            </div>
            <form>
              <label class="form-label">Username</label>
              <input type="text" class="form-control mb-2" value="${username}">
              <label class="form-label">Role</label>
              <select class="form-select mb-2">
                <option value="Manager" ${role === "Manager" ? "selected" : ""}>Manager</option>
                <option value="Scientist" ${role === "Scientist" ? "selected" : ""}>Scientist</option>
                <option value="Administrator" ${role === "Administrator" ? "selected" : ""}>Administrator</option>
              </select>
              <label class="form-label">Password</label>
              <input type="password" class="form-control mb-3" value="${password}">
              <button type="button" class="btn btn-primary w-100">Update</button>
            </form>
          </div>
        </div>
      `;
  
      // Append the new user card to the user section
      userSection.appendChild(newUserCard);
  
      // Reset the form and close the modal
      addUserForm.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById("addUserModal"));
      modal.hide();
    });
  });
  