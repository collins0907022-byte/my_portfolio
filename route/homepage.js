const header = document.querySelector(".header");
const logo = document.querySelector(".logo");
const navLinks = document.querySelectorAll(".nav a");

let isScrolling;

// **Function to show header with animation**
function showHeader() {
  header.classList.add("active");
}

// **Function to hide header**
function hideHeader() {
  header.classList.remove("active");
}

// **Initial load animation**
window.addEventListener("load", () => {
  showHeader();
});

// **Scroll detection**
window.addEventListener("scroll", () => {
  hideHeader();

  // Clear previous timeout
  clearTimeout(isScrolling);

  // After 200ms of no scroll -> show header
  isScrolling = setTimeout(() => {
    showHeader();
  }, 200);
});
//toggle menu

const toggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
let menuOpen = false;

function animateHamburger(open) {
  const spans = toggle.querySelectorAll("span");

  if (open) {
    gsap.to(spans[0], { rotation: 45, y: 8, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.3 });
    gsap.to(spans[2], { rotation: -45, y: -8, duration: 0.3 });
  } else {
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
  }
}

toggle.addEventListener("click", () => {
  menuOpen = !menuOpen;
  const links = mobileMenu.querySelectorAll("a");

  if (menuOpen) {
    mobileMenu.style.display = "flex";

    // Animate menu scaling and sliding
    gsap.to(mobileMenu, {
      opacity: 1,
      scale: 1,
      x: "0%",
      duration: 0.6,
      ease: "power3.out",
    });

    // Animate links emerging like energy / galaxy effect
    gsap.to(links, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: "elastic.out(1, 0.6)",
    });
  } else {
    // Animate links disappearing first
    gsap.to(links, {
      opacity: 0,
      y: 50,
      scale: 0.5,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
    });

    // Animate menu closing after links disappear
    gsap.to(mobileMenu, {
      opacity: 0,
      scale: 0.8,
      x: "100%",
      duration: 0.5,
      ease: "power3.in",
      delay: 0.25,
      onComplete: () => {
        mobileMenu.style.display = "none";
      },
    });
  }

  animateHamburger(menuOpen);
});

// HERO ANIMATION gsap.to(".left", { x: 0, opacity: 1, duration: 1, delay: 0.8 });

gsap.to(".right", { x: 0, opacity: 1, duration: 1, delay: 1 });

gsap.to(".scroll", { opacity: 1, y: -10, delay: 1.5 });
gsap.to(".left", {
  x: 0,
  opacity: 1,
  duration: 1,
});

gsap.to(".right", {
  x: 0,
  opacity: 1,
  duration: 1,
  delay: 0.3,
});

gsap.to(".left", { x: 0, opacity: 1, duration: 1, delay: 0.8 });

gsap.to(".right", { x: 0, opacity: 1, duration: 1, delay: 1 });

gsap.to(".scroll", { opacity: 1, y: -10, delay: 1.5 });

// STAR BACKGROUND ANIMATION
const canvas = document.getElementById("star-bg");
const ctx = canvas.getContext("2d");

// Resize canvas to container
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Main stars
const numStars = 50; // lots of dots
const stars = [];
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 1,
  });
}

// Twinkle background stars
const twinkleStars = [];
for (let i = 0; i < 150; i++) {
  twinkleStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    delta: Math.random() * 0.02 + 0.01,
  });
}

// Animation loop
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw twinkle stars
  twinkleStars.forEach((star) => {
    star.alpha += star.delta;
    if (star.alpha > 1 || star.alpha < 0) star.delta *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

    const colors = [
      "#fff",
      "#f5f5a3",
      "#ff7f7f",
      "#7fffd4",
      "#a3d1ff",
      "#ffffff",
      "#f5f5a3",
      "#ffd700",
      "#a3d1ff",
      "#7fffd4",
      "#caa6ff",
      "#ffb3c6",
      "#baffc9",
      "#ffdfba",
      "#e0ffff",
    ]; // white, yellowish, red, teal, light blue
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${star.alpha})`;
    ctx.fill();
  });

  // Move and draw main stars
  stars.forEach((star) => {
    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

    const colors = [
      "#fff",
      "#f5f5a3",
      "#ff7f7f",
      "#7fffd4",
      "#a3d1ff",
      "#ffffff",
      "#f5f5a3",
      "#ffd700",
      "#a3d1ff",
      "#7fffd4",
      "#caa6ff",
      "#ffb3c6",
      "#baffc9",
      "#ffdfba",
      "#e0ffff",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = color;
    ctx.fill();
  });

  // Connect nearby stars
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        // connect stars within 100px
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateStars);
}

animateStars();

//testimonial animation on scroll
const testimonialHeading = document.querySelector(".testimonial-heading");
const bigCard = document.querySelector(".big-card");
const smallCards = document.querySelectorAll(".small-card");

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight - 100;
}

// Animate on scroll
function animateTestimonials() {
  if (isInViewport(testimonialHeading)) {
    testimonialHeading.classList.add("active");
  } else {
    testimonialHeading.classList.remove("active");
  }

  if (isInViewport(bigCard)) {
    bigCard.classList.add("active");
  } else {
    bigCard.classList.remove("active");
  }

  smallCards.forEach((card, i) => {
    if (isInViewport(card)) {
      setTimeout(() => {
        card.classList.add("active");
      }, i * 100); // staggered animation
    } else {
      card.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", animateTestimonials);
window.addEventListener("load", animateTestimonials);

// Horizontal arrows scroll small cards
const scrollAmount = 300;
const smallCardsContainer = document.getElementById("small-cards");

document.getElementById("arrow-right").addEventListener("click", () => {
  smallCardsContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

document.getElementById("arrow-left").addEventListener("click", () => {
  smallCardsContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

const hero = document.querySelector(".hero");
const left = document.querySelector(".left");
const star = document.querySelector("#star-bg-container");

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - 100 && rect.bottom > 100;
}

function handleHeroAnimation() {
  if (isInViewport(hero)) {
    left.classList.add("show");
    star.classList.add("show");
  } else {
    left.classList.remove("show");
    star.classList.remove("show");
  }
}

window.addEventListener("scroll", handleHeroAnimation);
window.addEventListener("load", handleHeroAnimation);

// Featured slider with progress bar and 20 testimonials (backend-ready)

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".featured-slider");
  if (!slider) return;

  const duration = 10000; // 10s

  const data = Array.from({ length: 20 }, (_, i) => ({
    name: "User " + (i + 1),
    text: "This is testimonial number " + (i + 1),
    image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i + 10}.jpg`,
  }));

  let index = 0;

  function createSlide(item) {
    const div = document.createElement("div");
    div.className = "slide active"; // already active
    div.innerHTML = `
      <div class="top">
        <img src="${item.image}">
        <h3>Hi, I am ${item.name}</h3>
      </div>
      <p>${item.text}</p>
    `;
    return div;
  }

  // FIRST SLIDE
  let currentSlide = createSlide(data[0]);
  slider.appendChild(currentSlide);

  // PROGRESS BAR
  const progress = document.createElement("div");
  progress.className = "progress";
  progress.innerHTML = `<div class="progress-bar"></div>`;
  slider.appendChild(progress);

  const bar = progress.querySelector(".progress-bar");

  function startProgress() {
    bar.style.transition = "none";
    bar.style.width = "0%";

    setTimeout(() => {
      bar.style.transition = `width ${duration}ms linear`;
      bar.style.width = "100%";
    }, 50);
  }

  function changeSlide() {
    index = (index + 1) % data.length;

    const next = createSlide(data[index]);
    next.style.transform = "translateX(100%)";
    next.style.opacity = "1";

    slider.appendChild(next);

    // FORCE POSITION FIRST
    requestAnimationFrame(() => {
      // current goes left
      currentSlide.style.transform = "translateX(-100%)";
      currentSlide.style.opacity = "0";

      // new comes in
      next.style.transform = "translateX(0)";
    });

    // CLEANUP AFTER ANIMATION
    setTimeout(() => {
      if (currentSlide) currentSlide.remove();
      currentSlide = next;
    }, 600);

    startProgress();
  }

  // 🔥 ONE CLEAN LOOP (NO CONFLICT)
  setInterval(changeSlide, duration);

  // START
  startProgress();
});

//..take note OF THIS PART BELOW, IT'S FOR THE TESTIMONIALS SECTION, NOT THE HERO

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("small-cards");
  if (!container) return;

  const testimonials = Array.from({ length: 8 }, (_, i) => ({
    name: "User " + (i + 1),
    text: "This is testimonial number " + (i + 1),
    image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i + 10}.jpg`,
  }));

  let currentIndex = null;

  function renderCards() {
    container.innerHTML = "";

    testimonials.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "small-card";
      card.innerHTML = `
        <p>${item.text}</p>
        <span>- ${item.name}</span>
        <button class="expand-btn">➕</button>
      `;
      container.appendChild(card);

      card.querySelector(".expand-btn").onclick = () => expandCard(index);
    });

    animateCards();
  }

  // Dynamic entry animation for small cards
  function animateCards() {
    const cards = container.querySelectorAll(".small-card");

    cards.forEach((card) => {
      card.style.opacity = 0;
      card.style.transition = "none";
    });

    cards.forEach((card, i) => {
      setTimeout(() => {
        const directions = [
          "translateX(-100px)",
          "translateX(100px)",
          "translateY(-100px)",
          "translateY(100px)",
        ];
        const randomDir =
          directions[Math.floor(Math.random() * directions.length)];
        card.style.transform = randomDir;

        requestAnimationFrame(() => {
          card.style.transition = "all 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
          card.style.opacity = 1;
          card.style.transform = "translateX(0) translateY(0)";
        });
      }, i * 120);
    });
  }

  function expandCard(index) {
    const allCards = container.querySelectorAll(".small-card");

    allCards.forEach((card) => (card.style.display = "flex"));

    const old = container.querySelector(".expanded-card");
    if (old) old.remove();

    allCards[index].style.display = "none";

    const data = testimonials[index];
    const big = document.createElement("div");
    big.className = "expanded-card";

    big.style.opacity = 0;
    big.style.transform = "scale(0.9) translateY(20px)";

    big.innerHTML = `
      <img src="${data.image}">
      <div style="width:55%; display:flex; flex-direction:column; justify-content:space-between;">
        <div class="testmonialText">
          <p>${data.text}</p>
          <span>- ${data.name}</span>
        </div>
        <div class="expandedNav">
          <p class="prev">⩤</p>
          <p class="next">⩥</p>
        </div>
      </div>
    `;

    container.insertBefore(big, allCards[index]);
    currentIndex = index;

    // Smooth alive expansion
    requestAnimationFrame(() => {
      big.style.transition = "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)";
      big.style.opacity = 1;
      big.style.transform = "scale(1) translateY(0)";
    });

    big.querySelector(".prev").onclick = () => {
      if (currentIndex > 0) expandCard(currentIndex - 1);
    };
    big.querySelector(".next").onclick = () => {
      if (currentIndex < testimonials.length - 1) expandCard(currentIndex + 1);
    };
  }

  function resetAll() {
    const big = container.querySelector(".expanded-card");
    if (big) big.remove();

    const allCards = container.querySelectorAll(".small-card");
    allCards.forEach((card) => (card.style.display = "flex"));

    animateCards();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) resetAll();
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(container);

  // Initial render
  renderCards();
});

// CODE TYPING ANIMATION FOR FEATURED SECTION (BACKEND-READY)
const snippets = [
  [
    `// STYLE 1: EventSource Streaming
const source=new EventSource('/events');
source.onmessage=e=>{const d=JSON.parse(e.data);render(d);};function render(d){console.log(d);}`,
    `

// STYLE 2: Polling
async function poll(){const r=await fetch('/events');const d=await r.json();console.log(d);}setInterval(poll,3000);`,
    `

// STYLE 3: WebSocket
const socket=new WebSocket('wss://server');socket.onmessage=e=>console.log(JSON.parse(e.data));`,
  ],
  [
    `// STYLE 1: JWT
const token=jwt.sign({id:user.id},SECRET,{expiresIn:'1h'});localStorage.setItem('token',token);`,
    `

// STYLE 2: Session
req.session.user={id:user.id};req.session.save();`,
    `

// STYLE 3: OAuth
passport.authenticate('google');`,
  ],
  [
    `// STYLE 1: REST Microservice
app.get('/users',async(req,res)=>{const users=await db.getUsers();res.json(users);});`,
    `

// STYLE 2: Message Queue
channel.consume('jobs',msg=>{process(JSON.parse(msg.content));});`,
    `

// STYLE 3: gRPC
client.getUser({id:1},(err,res)=>console.log(res));`,
  ],
  [
    `// STYLE 1: Indexing
CREATE INDEX idx_email ON users(email);`,
    `

// STYLE 2: Query Optimization
EXPLAIN ANALYZE SELECT * FROM users;`,
    `

// STYLE 3: Caching
redis.set('users',JSON.stringify(data));`,
  ],
  [
    `// STYLE 1: Jest Unit Test
describe('login',()=>{it('works',()=>{expect(true).toBe(true);});});`,
    `

// STYLE 2: Integration Test
await request(app).post('/login').send(data);`,
    `

// STYLE 3: E2E Test
cy.visit('/login');cy.get('input').type('user');`,
  ],
  [
    `// STYLE 1: Docker
docker build -t app .`,
    `

// STYLE 2: Kubernetes
kubectl apply -f deployment.yaml`,
    `

// STYLE 3: CI/CD
workflow: build->test->deploy`,
  ],
  [
    `// STYLE 1: Native WS
const ws=new WebSocket('wss://server');`,
    `

// STYLE 2: Socket.io
const socket=io('https://server');`,
    `

// STYLE 3: SSE
new EventSource('/events');`,
  ],
  [
    `// STYLE 1: OpenAI
const r=await ai.generate({prompt:'Hello'});`,
    `

// STYLE 2: Embeddings
const e=await ai.embed(text);`,
    `

// STYLE 3: Streaming
for await (const chunk of ai.stream()){console.log(chunk);}`,
  ],
];

const codes = [
  "code1",
  "code2",
  "code3",
  "code4",
  "code5",
  "code6",
  "code7",
  "code8",
];
let typedInstances = [];

function highlightWhileTyping(el) {
  setTimeout(() => Prism.highlightElement(el), 50);
}

function startTyping(i) {
  const el = document.getElementById(codes[i]);
  const container = el.closest(".code-scroll");

  // concatenate all three styles so they type one after another without clearing
  const fullSequence = snippets[i].join("");

  typedInstances[i] = new Typed(el, {
    strings: [fullSequence],
    typeSpeed: 15,
    backSpeed: 0,
    loop: true,
    showCursor: false,
    onBegin: () => {
      el.textContent = "";
    },
    onStringTyped: () => {
      Prism.highlightElement(el);
      // auto scroll upward as code grows
      container.scrollTop = container.scrollHeight;
    },
    onComplete: () => {
      // wait 3 seconds then restart typing from top
      setTimeout(() => {
        el.textContent = "";
        container.scrollTop = 0;
        typedInstances[i].reset();
        typedInstances[i].start();
      }, 8000);
    },
  });
}

function resetTyping(i) {
  if (typedInstances[i]) {
    typedInstances[i].destroy();
    typedInstances[i] = null;
    document.getElementById(codes[i]).textContent = "";
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.target.id === "title") {
        entry.target.classList.toggle("visible", entry.isIntersecting);
        return;
      }
      const sections = [...document.querySelectorAll(".feature")];
      const i = sections.indexOf(entry.target);
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (!typedInstances[i]) startTyping(i);
      } else {
        entry.target.classList.remove("visible");
        resetTyping(i);
      }
    });
  },
  { threshold: 0.4 },
);

observer.observe(document.getElementById("title"));
document.querySelectorAll(".feature").forEach((s) => observer.observe(s));

const buttons = document.querySelectorAll(".control-btn");
buttons.forEach((b, i) => {
  b.onclick = () => {
    const t = typedInstances[i];
    if (!t) return;
    if (b.textContent === "Pause") {
      t.stop();
      b.textContent = "Play";
    } else {
      t.start();
      b.textContent = "Pause";
    }
  };
});

// =========================
// FOOTER SCROLL ANIMATION
// =========================

const devFooter = document.getElementById("devFooter");

const footerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        devFooter.classList.add("visible");
      } else {
        devFooter.classList.remove("visible"); // reset animation
      }
    });
  },
  {
    threshold: 0.3,
  },
);

footerObserver.observe(devFooter);
