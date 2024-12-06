// Ensure your page loads properly before running scripts
document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display users when the page loads
  fetchUsersFromBackend();
});

// Fetch Users
async function fetchUsersFromBackend() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:8080/api/v1/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      const users = response.data; // Assuming the response contains a list of users
      displayUserCards(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Display User Cards
function displayUserCards(users) {
  const userSection = document.querySelector(".user-section");
  userSection.innerHTML = ""; // Clear existing content

  users.forEach((user) => {
    const card = generateUserCardHTML(
      user.id,
      user.name,
      user.email,
      user.role,
      user.username,
      "******" // Masked password (update logic handles actual password changes)
    );
    userSection.appendChild(card);
  });
}

// Generate User Card HTML
function generateUserCardHTML(id, name, email, role, username, password) {
  const card = document.createElement("div");
  card.classList.add("col-md-4");

  card.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex align-items-center mb-3">
          <img
            src="/assets/default-avatar.png"
            alt="Avatar"
            class="rounded-circle me-3"
            width="50"
          />
          <div>
            <h5 class="card-title mb-0">${name}</h5>
            <p class="text-muted small">${email}</p>
            <p class="badge bg-primary">${role}</p>
          </div>
        </div>
        <form onsubmit="event.preventDefault(); updateUser('${id}')">
          <label for="username-${id}" class="form-label">Username</label>
          <input
            type="text"
            id="username-${id}"
            class="form-control mb-2"
            value="${username}"
          />
          <label for="role-${id}" class="form-label">Role</label>
          <select id="role-${id}" class="form-select mb-2">
            <option value="Manager" ${role === "Manager" ? "selected" : ""}>Manager</option>
            <option value="Scientist" ${role === "Scientist" ? "selected" : ""}>Scientist</option>
            <option value="Administrator" ${role === "Administrator" ? "selected" : ""}>Administrator</option>
          </select>
          <label for="password-${id}" class="form-label">Password</label>
          <input
            type="password"
            id="password-${id}"
            class="form-control mb-3"
            value="${password}"
          />
          <button type="submit" class="btn btn-primary w-100">Update</button>
        </form>
        <button class="btn btn-danger w-100 mt-2" onclick="deleteUser('${id}')">Delete</button>
      </div>
    </div>
  `;
  return card;
}

// Add User
document.getElementById("addUserForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const newName = document.getElementById("newName").value;
  const newEmail = document.getElementById("newEmail").value;
  const newRole = document.getElementById("newRole").value;
  const newUsername = document.getElementById("newUsername").value;
  const newPassword = document.getElementById("newPassword").value;

  const userData = {
    name: newName,
    email: newEmail,
    role: newRole,
    username: newUsername,
    password: newPassword,
  };

  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post("http://localhost:8080/api/v1/user", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 201) {
      Swal.fire("Success", "User added successfully", "success").then(() => {
        fetchUsersFromBackend();
        bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
      });
    }
  } catch (error) {
    Swal.fire("Error", "An error occurred while adding the user", "error");
    console.error(error);
  }
});

// Update User
async function updateUser(id) {
  const username = document.getElementById(`username-${id}`).value;
  const role = document.getElementById(`role-${id}`).value;
  const password = document.getElementById(`password-${id}`).value;

  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`http://localhost:8080/api/v1/user/${id}`, {
      username,
      role,
      password,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      Swal.fire("Success", "User updated successfully", "success").then(() => fetchUsersFromBackend());
    }
  } catch (error) {
    Swal.fire("Error", "Failed to update user", "error");
    console.error(error);
  }
}

// Delete User
async function deleteUser(id) {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the user permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(`http://localhost:8080/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 204) {
        Swal.fire("Deleted", "User deleted successfully", "success").then(() => fetchUsersFromBackend());
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete user", "error");
      console.error(error);
    }
  }
}
