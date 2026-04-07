async function requireAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const res = await fetch("https://alexsite-qpff.onrender.com/auth-check", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      localStorage.removeItem("token");
      redirectToLogin();
    }
  } catch (err) {
    console.error("Auth check failed");
  }
}

function redirectToLogin() {
  localStorage.setItem("redirectAfterLogin", window.location.href);
  window.location.href = "login.html";
}
