const signupForm = document.getElementById("signupForm");
const responseMessage = document.getElementById("responseMessage");

// Add a submit event listener
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission refresh

  // Collect form data
  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value,
  };

  try {
    // Make AJAX request using Fetch API
    const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

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
      setTimeout(() => {
        window.location.href = "/index.html"; // Redirect to login page after 2 seconds
      }, 2000);
    } else {
      responseMessage.textContent = result.message || "Signup failed!";
      responseMessage.style.color = "red";
    }
  } catch (error) {
    // Handle errors
    responseMessage.textContent = "An error occurred. Please try again.";
    responseMessage.style.color = "red";
    console.error("Error:", error);
  }
});
