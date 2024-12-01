// Mock user data
let users = [
    { username: 'john_doe', role: 'Admin', email: 'john@example.com' },
    { username: 'jane_doe', role: 'User', email: 'jane@example.com' }
];

// Function to display users in the table
function displayUsers() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser('${user.username}')"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteUser('${user.username}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to add a new user
function addUser() {
    const username = document.querySelector('input[placeholder="Username"]').value;
    const role = document.querySelector('select').value;
    const email = document.querySelector('input[placeholder="Email"]').value;

    // Basic validation
    if (username && role && email) {
        users.push({ username, role, email });
        displayUsers();
        clearForm();
    } else {
        alert("Please fill all fields.");
    }
}

// Function to edit a user
function editUser(username) {
    const user = users.find(user => user.username === username);
    if (user) {
        document.querySelector('input[placeholder="Username"]').value = user.username;
        document.querySelector('select').value = user.role;
        document.querySelector('input[placeholder="Email"]').value = user.email;
        document.querySelector('button.add-user').style.display = 'none'; // Hide Add button
        document.querySelector('button.update-user').style.display = 'inline'; // Show Update button
        document.querySelector('button.update-user').onclick = () => updateUser(username);
    }
}

// Function to update a user
function updateUser(oldUsername) {
    const username = document.querySelector('input[placeholder="Username"]').value;
    const role = document.querySelector('select').value;
    const email = document.querySelector('input[placeholder="Email"]').value;

    // Basic validation
    if (username && role && email) {
        const userIndex = users.findIndex(user => user.username === oldUsername);
        if (userIndex !== -1) {
            users[userIndex] = { username, role, email };
            displayUsers();
            clearForm();
            document.querySelector('button.add-user').style.display = 'inline'; // Show Add button
            document.querySelector('button.update-user').style.display = 'none'; // Hide Update button
        }
    } else {
        alert("Please fill all fields.");
    }
}

// Function to delete a user
function deleteUser(username) {
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        displayUsers();
    }
}

// Function to search users
function searchUsers() {
    const searchTerm = document.querySelector('input[placeholder="Search users..."]').value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser('${user.username}')"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteUser('${user.username}')"><i class="fa-solid fa-trash" style="color: #e9542f;"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to clear the form
function clearForm() {
    document.querySelector('input[placeholder="Username"]').value = '';
    document.querySelector('select').value = 'user'; // Reset to default
    document.querySelector('input[placeholder="Email"]').value = '';
}

// Event listeners
document.querySelector('button.add-user').addEventListener('click', addUser);
document.querySelector('input[placeholder="Search users..."]').addEventListener('input', searchUsers);

// Initial display of users
displayUsers();
document.addEventListener("DOMContentLoaded", () => {
    // Simulated user data - Replace with your actual backend API call or session info
    const currentUser = {
      username: "manager123",
      name: "Jane Smith",
      role: "Manager",
      email: "jane@example.com",
      image: "assests\pexels-bobby-mc-gee-lee-77973442-16762584-fields.jpg", // Replace with actual image path
    };
  
    // Elements to populate
    const userImage = document.getElementById("currentUserImage");
    const userName = document.getElementById("currentUserName");
    const userRole = document.getElementById("currentUserRole");
    const userEmail = document.getElementById("currentUserEmail");
  
    // Populate fields
    userImage.src = currentUser.image || "/path/to/default-avatar.png"; // Default image fallback
    userName.textContent = currentUser.name;
    userRole.textContent = currentUser.role;
    userEmail.textContent = currentUser.email;
  });
  