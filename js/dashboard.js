document.addEventListener("DOMContentLoaded", () => {
  // Display current date
  const dateElement = document.getElementById("date");
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Sample data for weather and tasks
  const weatherData = {
    temperature: "26°C",
    condition: "Cloudy",
  };

  const tasksData = [
    { task: "Visit Field A", time: "9:00 AM" },
    { task: "Inspect Crop B", time: "10:30 AM" },
  ];

  // Update weather info
  updateWeatherInfo(weatherData);
  // Update tasks list
  updateTasksList(tasksData);

  // Search functionality placeholder
  const searchInput = document.querySelector('input[type="text"]');
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    console.log(`Searching for: ${searchTerm}`);
  });

  // Get user's location and initialize the map
  getUserLocation();
});

// Function to update weather information
function updateWeatherInfo(data) {
  const weatherSection = document.querySelector(".weather");
  weatherSection.innerHTML = `
    <h3>Weather Info</h3>
    <p>Temperature: ${data.temperature}</p>
    <p>Condition: ${data.condition}</p>
  `;
}

// Function to update the tasks list
function updateTasksList(tasks) {
  const tasksSection = document.querySelector(".tasks ul");
  tasksSection.innerHTML = ""; // Clear existing tasks
  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${task.task} - ${task.time}`;
    tasksSection.appendChild(listItem);
  });
}

// Function to get the user's location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        
        // Initialize the map with user's location
        initializeMap(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
        // Initialize the map at a default location (e.g., a central point)
        initializeMap(0, 0);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    alert("Geolocation is not supported by your browser.");
    // Initialize the map at a default location (e.g., a central point)
    initializeMap(0, 0);
  }
}

// Function to initialize the map
function initializeMap(latitude, longitude) {
  const map = L.map('map').setView([latitude, longitude], 13); // Set map view to user's location

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add a marker for the user's location
  L.marker([latitude, longitude]).addTo(map)
    .bindPopup('You are here!')
    .openPopup();
}
