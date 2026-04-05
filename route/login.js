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

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const user = await res.json();

  if (!res.ok) {
    alert(user.error || "Login failed");
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

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      loginTab.click();
    }
  } catch (err) {
    console.error("Registration error:", err);
    alert("An error occurred during registration. Please try again.");
  }
});
