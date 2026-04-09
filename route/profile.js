async function loadProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found, redirecting to login");
    window.location.href = "index.html";
    return;
  }

  const res = await fetch("https://alexsite-qpff.onrender.com/profile", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) {
    console.warn("Failed to load profile, redirecting to login");
    localStorage.removeItem("token");
    window.location.href = "index.html";
    return;
  }
  const data = await res.json();

  document.getElementById("name").textContent = data.name;
  document.getElementById("username").textContent = "@" + data.username;
  document.getElementById("email").textContent = data.email;
  document.getElementById("joined").textContent = new Date(
    data.created_at,
  ).toDateString();

  if (data.avatar) {
    document.getElementById("avatar").src = data.avatar;
    document.getElementById("avatar").style.display = "block";
    document.getElementById("avatarFallback").style.display = "none";

    // Modal preview
    document.getElementById("avatarModalPreview").src = data.avatar;
    document.getElementById("avatarModalPreview").style.display = "block";
    document.getElementById("avatarModalFallback").style.display = "none";
  }
  const currentAvatar =
    data.avatar ||
    `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNlZWUiIHJ4PSI2MCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjI0IiBmaWxsPSIjY2NjIi8+PHJlY3QgeT0iNzAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==`;
  document.getElementById("editName").value = data.name;
}

loadProfile();

//profile preview modal

let selectedFile = null;

// Load profile from backend
async function loadUpdatedProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, redirecting to login");
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(
      "https://alexsite-qpff.onrender.com/updatedProfile",
      {
        headers: { Authorization: "Bearer " + token },
      },
    );

    const data = await res.json();
    console.log("Updated profile data:", data);

    const defaultAvatar = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNlZWUiIHJ4PSI2MCIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjI0IiBmaWxsPSIjY2NjIi8+PHJlY3QgeT0iNzAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==`;

    // Fill profile card
    document.getElementById("displayName").textContent = data.name;
    document.getElementById("displayUsername").textContent =
      "@" + data.username;
    document.getElementById("profileImage").src = data.avatar || defaultAvatar;
    document.getElementById("modalImage").src = data || defaultAvatar;
  } catch (err) {
    console.error(err);
    console.error("Failed to load updated profile:", err);
  }
}

loadUpdatedProfile();
// Open modal and prefill inputs
function openModal() {
  document.getElementById("editModal").style.display = "flex";
  document.getElementById("nameInput").value =
    document.getElementById("displayName").textContent;
  document.getElementById("usernameInput").value = document
    .getElementById("displayUsername")
    .textContent.replace("@", "");
  document.getElementById("modalImage").src =
    document.getElementById("profileImage").src;
}

// Close modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
  selectedFile = null; // Reset selected file
  loadProfile(); // Reset modal avatar to original
}

// Close modal when clicking outside content
document.getElementById("editModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Open file picker
function openFilePicker() {
  document.getElementById("fileInput").click();
}

// Preview selected avatar
document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("modalImage").src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Save updated profile
async function saveProfile() {
  const name = document.getElementById("nameInput").value.trim();
  const username = document.getElementById("usernameInput").value.trim();
  const token = localStorage.getItem("token");

  if (!name || !username) {
    console.warn("Name and username cannot be empty");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  if (selectedFile) formData.append("avatar", selectedFile);

  try {
    const res = await fetch(
      "https://alexsite-qpff.onrender.com/updateProfile",
      {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      },
    );

    const data = await res.json();
    showToast("profile updated successfully", "success");
    console.log("Update response:", data);
    if (res.ok) {
      document.getElementById("displayName").textContent = username;
      document.getElementById("displayUsername").textContent = "@" + username;
      if (data.avatar) closeModal();
    } else {
      showToast("profile updated successfully", "error");
      console.error("Update failed:", data);
    }
  } catch (err) {
    showToast("profile updated successfully", "error");
    console.error(err);
    console.error("Profile update failed:", err);
  }
}

const logoutBtn = document.getElementById("logoutBtn");
function getToken() {
  return localStorage.getItem("token");
}

// Logout function
async function logout() {
  const token = getToken();
  if (!token) {
    window.location.href = "index.html"; // redirect immediately if no token
    return;
  }

  try {
    const res = await fetch("https://alexsite-qpff.onrender.com/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();
    console.log(data);

    // Delete token locally
    localStorage.removeItem("token");

    // Redirect to index.html
    window.location.href = "index.html";
  } catch (err) {
    console.error("Logout failed:", err);
    // Still delete token and redirect to index
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}

logoutBtn.addEventListener("click", logout);

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
