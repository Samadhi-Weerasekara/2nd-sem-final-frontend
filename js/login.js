const signinForm = document.getElementById("signinForm");
const responseMessage = document.getElementById("responseMessage");

// Add a submit event listener
signinForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission refresh

  // Collect form data
  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  // Validate form data before sending request
  if (!formData.email || !formData.password) {
    responseMessage.textContent = "Both email and password are required!";
    responseMessage.style.color = "red";
    return;
  }

  try {
    // Make AJAX request using Fetch API
    const response = await fetch(
      "http://localhost:8080/api/v1/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.json();

    // Handle the response
    if (response.ok) {
        document.querySelector("#responseToast .toast-body").textContent =
          "Signup successful!";
        const toastElement = document.getElementById("responseToast");
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

      // Save token (optional)
      console.log(result.token);
      localStorage.setItem("authToken", result.token);

      // Redirect to the dashboard or home page after 2 seconds
      setTimeout(() => {
        window.location.href = "pages/main.html"; // Adjust the redirect page as needed
      }, 2000);
    } else {
      responseMessage.textContent = result.message || "Signin failed!";
      responseMessage.style.color = "red";
    }
  } catch (error) {
    // Handle network or other errors
    responseMessage.textContent = "An error occurred. Please try again.";
    responseMessage.style.color = "red";
    console.error("Error:", error);
  }
});