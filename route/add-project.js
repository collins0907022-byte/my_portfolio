const token = localStorage.getItem("token");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const logout = document.getElementById("logout");

// ===== ADMIN VERIFY =====
async function verifyAdmin() {
  const code = document.getElementById("code").value;
  try {
    const res = await fetch("https://alexsite-qpff.onrender.com/verifyAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      overlay.style.display = "none";
      sessionStorage.setItem("admin", "true");
    } else {
      modal.classList.remove("shake");
      void modal.offsetWidth;
      modal.classList.add("shake");
      setTimeout(() => (window.location.href = "index.html"), 500);
    }
  } catch (e) {
    window.location.href = "index.html";
  }
}
if (sessionStorage.getItem("admin") === "true") {
  overlay.style.display = "none";
}

// ===== TECH STACK =====
const tagInput = document.querySelector(".tag-input");
const tagbox = document.getElementById("tagbox");
let tags = [];
function renderTags() {
  tagbox.querySelectorAll(".tag").forEach((t) => t.remove());
  tags.forEach((t, i) => {
    const el = document.createElement("div");
    el.className = "tag";
    el.innerHTML = `${t} <button data-i="${i}">×</button>`;
    tagbox.insertBefore(el, tagInput);
  });
}
tagbox.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const i = +e.target.dataset.i;
    tags.splice(i, 1);
    renderTags();
  }
});
tagInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && tagInput.value.trim()) {
    e.preventDefault();
    tags.push(tagInput.value.trim());
    tagInput.value = "";
    renderTags();
  }
});

// ===== IMAGE PREVIEW =====
const imagesInput = document.getElementById("images");
const thumbs = document.getElementById("thumbs");
let filesArr = [];
imagesInput.addEventListener("change", () => {
  filesArr = [...filesArr, ...Array.from(imagesInput.files)];
  renderThumbs();
});
function renderThumbs() {
  thumbs.innerHTML = "";
  filesArr.forEach((f, i) => {
    const url = URL.createObjectURL(f);
    const div = document.createElement("div");
    div.className = "thumb";
    div.innerHTML = `<img src="${url}"/><button data-i="${i}">×</button>`;
    thumbs.appendChild(div);
  });
}
thumbs.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const i = +e.target.dataset.i;
    filesArr.splice(i, 1);
    renderThumbs();
  }
});

// ===== FORM SUBMIT =====
document.getElementById("projectForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData();
  fd.append("name", document.getElementById("name").value);
  fd.append("description", document.getElementById("description").value);
  fd.append("techStack", JSON.stringify(tags));
  fd.append("liveLink", document.getElementById("live").value);
  fd.append("githubLink", document.getElementById("github").value);
  filesArr.forEach((f) => fd.append("images", f));
  try {
    const res = await fetch("https://alexsite-qpff.onrender.com/addProject", {
      method: "POST",
      body: fd,
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) showToast("Failed", "error");
    showToast("Project added successfully", "success");
    document.getElementById("projectForm").reset();
    tags = [];
    filesArr = [];
    renderThumbs();
  } catch (err) {
    showToast("Failed", "error");
  }
});

// ===== LOGOUT =====
logout.addEventListener("click", () => {
  localStorage.removeItem("token");

  sessionStorage.removeItem("admin");
  window.location.href = "index.html";
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
