document.addEventListener("DOMContentLoaded", function () {
  console.log("dom awa");
  checkTokenExpiration(); // On page load
  setInterval(() => {
    checkTokenExpiration(); // Periodic check every 60 seconds
  }, 1000 * 60);
});

function checkTokenExpiration() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    redirectToLogin(); // No token found, redirect to login
    return;
  }

  // Decode the JWT token (using a simple base64 decode method)
  const decodedToken = decodeJWT(token);

  if (!decodedToken || !decodedToken.exp) {
    redirectToLogin(); // Invalid token or no expiration info, redirect to login
    return;
  }

  // Check if the token is expired
  const currentTime = Date.now() / 1000; // Current time in seconds
  if (decodedToken.exp < currentTime) {
    localStorage.removeItem("authToken"); // Remove expired token
    redirectToLogin(); // Redirect to login page
  }
  console.log(" checkTokenExpiration awa");
}

function decodeJWT(token) {
  // JWT is in format "header.payload.signature"
  const base64Url = token.split(".")[1]; // Get the payload part of the JWT
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Decode base64Url
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  console.log(" decodeJWT awa");
  return JSON.parse(jsonPayload); // Parse JSON payload to get token data
}

function redirectToLogin() {
    Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "Log In",
        allowOutsideClick: false, // Prevent closing alert by clicking outside
      }).then(() => {
        // Redirect to login page
        window.location.href = 'http://127.0.0.1:5500/index.html';
      });
    console.log('redirectToLogin awa');
   
}
