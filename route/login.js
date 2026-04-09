const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginTab.onclick = () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("show");
  registerForm.classList.remove("show");
};

registerTab.onclick = () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("show");
  loginForm.classList.remove("show");
};

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(loginForm));

  const res = await fetch("https://alexsite-qpff.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const user = await res.json();

  if (!res.ok) {
    showToast("Login failed", "error");
    return;
  }

  // Save token in localStorage
  localStorage.setItem("token", user.token);

  // Redirect user
  const redirect = localStorage.getItem("redirectAfterLogin");

  if (redirect) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirect;
  } else {
    window.location.href = "login.html";
  }
});

registerForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(registerForm));

    const res = await fetch("https://alexsite-qpff.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showToast("registration successfully", "success");
      loginTab.click();
    }
  } catch (err) {
    console.error("Registration error:", err);
    showToast(
      "An error occurred during registration. Please try again.",
      "error",
    );
  }
});

// showtoast function**********************************8
function showToast(message, type = "success", duration = 4000) {
  const container = document.getElementById("toast-container");

  // Create toast
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);

  // HTML structure
  toast.innerHTML = `
    <span>${message}</span>
    <span class="close-btn">&times;</span>
    <div class="toast-progress"></div>
  `;

  // Add to container
  container.appendChild(toast);

  // Slide-in animation
  toast.style.animation = `slideIn 0.5s forwards`;

  // Progress bar animation
  const progress = toast.querySelector(".toast-progress");
  progress.style.animation = `progressBar ${duration}ms linear forwards`;

  // Close button
  toast.querySelector(".close-btn").onclick = () => removeToast(toast);

  // Auto-remove after duration
  const autoRemove = setTimeout(() => removeToast(toast), duration);

  // Remove function
  function removeToast(toastElement) {
    toastElement.style.animation = `slideOut 0.5s forwards`;
    setTimeout(() => {
      if (toastElement.parentNode)
        toastElement.parentNode.removeChild(toastElement);
    }, 500);
    clearTimeout(autoRemove);
  }
}
