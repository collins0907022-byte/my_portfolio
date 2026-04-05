// Populate the dots
const dotsContainer = document.querySelector(".dots-container");
for (let i = 0; i < 10; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dotsContainer.appendChild(dot);
}

// Scroll hide/show header
let scrollTimer;
let lastScrollTop = 0;
const header = document.getElementById("app-header");

window.addEventListener("scroll", () => {
  const currentScroll =
    window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    header.style.transform = "translateY(-100%)";
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    header.style.transform = "translateY(0)";
  }, 300);
});

// mapping tech names to icons automatically
const techIcons = {
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "Node.js":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  React:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  MongoDB:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
};

const projects = [
  {
    title: "AI Car Dashboard",
    desc: "Control interface for autonomous vehicles.",
    tech: ["JavaScript", "Node.js"],
    live: "#",
    github: "#",
    images: [
      "https://picsum.photos/800/500?1",
      "https://picsum.photos/800/500?2",
      "https://picsum.photos/800/500?3",
    ],
  },
  {
    title: "E-commerce Platform",
    desc: "Full online store with payments.",
    tech: ["React", "MongoDB"],
    live: "#",
    github: "#",
    images: [
      "https://picsum.photos/800/500?4",
      "https://picsum.photos/800/500?5",
      "https://picsum.photos/800/500?6",
    ],
  },
  {
    title: "Weather Dashboard",
    desc: "Real-time weather monitoring interface.",
    tech: ["HTML", "CSS", "JavaScript"],
    live: "#",
    github: "#",
    images: [
      "https://picsum.photos/800/500?7",
      "https://picsum.photos/800/500?8",
      "https://picsum.photos/800/500?9",
    ],
  },
  {
    title: "Student Management System",
    desc: "System for managing students, courses and results.",
    tech: ["React", "Node.js", "MongoDB"],
    live: "#",
    github: "#",
    images: [
      "https://picsum.photos/800/500?10",
      "https://picsum.photos/800/500?11",
      "https://picsum.photos/800/500?12",
    ],
  },
];

const container = document.getElementById("projects");

projects.forEach((p, i) => {
  const section = document.createElement("div");
  section.className = "project" + (i % 2 ? " reverse" : "");

  section.innerHTML = `
 <div class="image">
  <img class="main" src="${p.images[0]}">
  <div class="thumbs">
   ${p.images.map((img, index) => `<img src="${img}" class="${index === 0 ? "active" : ""}">`).join("")}
  </div>
 </div>

 <div class="text">
  <h2>${p.title}</h2>
  <p class="sub-title">${p.desc}</p>
  

  <div class="tech">
   ${p.tech
     .map(
       (t) => `
    <div class="tech-item">
      <img src="${techIcons[t] || ""}" alt="${t} icon" class="tech-icon">
      <span>${t}</span>
    </div>
   `,
     )
     .join("")}
  </div>

  <div class="buttons">
   <a href="${p.live}" class="live">Live Demo</a>
   <a href="${p.github}" class="github">GitHub</a>
  </div>
 </div>`;

  container.appendChild(section);
});

// viewport animation with reset
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  { threshold: 0.2 },
);

observer.observe(document.querySelector(".hero"));
observer.observe(document.getElementById("devFooter"));

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".project").forEach((el) => observer.observe(el));
});

container.addEventListener("click", (e) => {
  if (e.target.closest(".thumbs img")) {
    const img = e.target;
    const wrapper = img.closest(".image");
    wrapper.querySelector(".main").src = img.src;
    wrapper
      .querySelectorAll(".thumbs img")
      .forEach((i) => i.classList.remove("active"));
    img.classList.add("active");
  }
});
