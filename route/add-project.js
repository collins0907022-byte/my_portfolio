const token = localStorage.getItem("token");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const logout = document.getElementById("logout");

// ===== ADMIN VERIFY =====
async function verifyAdmin() {
  const code = document.getElementById("code").value;
  try {
    const res = await fetch("http://localhost:5000/verifyAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    const res = await fetch("http://localhost:5000/addProject", {
      method: "POST",
      body: fd,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed");
    alert("Project added successfully");
    document.getElementById("projectForm").reset();
    tags = [];
    filesArr = [];
    renderThumbs();
  } catch (err) {
    alert("Error adding project");
  }
});

// ===== LOGOUT =====
logout.addEventListener("click", () => {
  localStorage.removeItem("token");

  sessionStorage.removeItem("admin");
  window.location.href = "index.html";
});
