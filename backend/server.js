const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const streamifier = require("streamifier");
const { createClient } = require("@supabase/supabase-js");
const { json } = require("stream/consumers");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

const privatekey = process.env.JWT_PRIVATE_KEY;
const dbPassword = process.env.DB_PASSWORD;

app.use(cookie());
app.use(express.json());
app.use(express.static("frontend"));
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  }),
);

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Supabase client for storage
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          timeout: 100000,
        });
      },
    },
  },
);

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  password: dbPassword,
  host: "localhost",
  port: 5432,
  database: "alexsite",
});

/*********************
token generate function
**********************/
function generatetoken(user) {
  const payload = user;
  return jwt.sign(payload, privatekey);
}
// ======================
// AUTH FUNCTION
// ======================
function getUserFromToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, privatekey);
  } catch {
    return null;
  }
}
// Create users table if it doesn't exist
async function createUsersTable() {
  try {
    await pool.query(`  
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(300) NULL

);
`);
    console.log("clients table is ready");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

createUsersTable();

//create projects table if it doesn't exist
async function createProjectsTable() {
  try {
    await pool.query(`
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack JSONB NOT NULL,
    live_link VARCHAR(255),
    github_link VARCHAR(255),
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
    console.log("projects table is ready");
  } catch (err) {
    console.error("Error creating projects table:", err);
  }
}

createProjectsTable();

// admin table
async function createAdminTable() {
  try {
    await pool.query(`
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT
);`);
    console.log("admin table is ready");
  } catch (err) {
    console.error("Error creating admin table:", err);
  }
}

createAdminTable();

//request table
async function createrequestTable() {
  try {
    await pool.query(`
CREATE TABLE IF NOT EXISTS request (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    fist_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);
    console.log("request table is ready");
  } catch (err) {
    console.error("Error creating request table:", err);
  }
}

createrequestTable();

// add testimonial table
async function createTestimonialTable() {
  try {
    await pool.query(`
CREATE TABLE IF NOT EXISTS testimonial (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);`);
    console.log("testimonial table is ready");
  } catch (err) {
    console.error("Error creating testimonial table:", err);
  }
}

createTestimonialTable();

//message table
async function createMessagesTable() {
  try {
    await pool.query(`
CREATE TABLE IF NOT EXISTS messages ( 

    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE
);`);
    console.log("messages table is ready");
  } catch (err) {
    console.error("Error creating messages table:", err);
  }
}

createMessagesTable();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET ADMIN PROFILE
app.get("/admin", async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  const result = await pool.query("SELECT * FROM admin LIMIT 1");
  res.json(result.rows[0]);
});

app.post("/register", async (req, res) => {
  console.log("Registration attempt:", req.body);
  const { username, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO clients(name, username, email, password) VALUES($1, $2, $3, $4)",
      [username, username, email, hashed],
    );

    res.json({ success: true });
    console.log("User registered:", username);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/login", async (req, res) => {
  console.log("Login attempt:", req.body);
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM clients WHERE email = $1", [
      email,
    ]);
    console.log("Login query result:", result.rows);
    if (result.rows.length === 0)
      return res.status(400).json({ success: false });

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json({ success: false });

    // CREATE TOKEN HERE
    const token = jwt.sign({ id: user.id, email: user.email }, privatekey, {
      expiresIn: "1d",
    });

    // SEND TOKEN TO FRONTEND
    res.json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ------------------- Get Profile ------------------- */

app.get("/profile", async (req, res) => {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const result = await pool.query("SELECT * FROM clients WHERE id=$1", [
    user.id,
  ]);

  res.json(result.rows[0]);
});

app.get("/updatedProfile", async (req, res) => {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const result = await pool.query(
    "SELECT name, username, avatar FROM clients WHERE id=$1",
    [user.id],
  );
  console.log("Updated profile query result:", result.rows[0]);
  res.json({
    name: result.rows[0].name,
    username: result.rows[0].username,
    avatar: result.rows[0].avatar,
  });
});

// Update profile
app.put("/updatProfile", upload.single("avatar"), async (req, res) => {
  console.log("Update profile attempt:", req.body);
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: "Not logged in" });
    }
    const { name, username } = req.body;

    let avatarUrl = null;
    const streamifier = require("streamifier");

    async function uploadBuffer(buffer, publicId) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", public_id: publicId, overwrite: true },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    }

    // Usage:
    if (req.file) {
      const result = await uploadBuffer(
        req.file.buffer,
        `${username}-${Date.now()}`,
      );
      avatarUrl = result.secure_url;
    }

    const query = `
      UPDATE clients
      SET name=$1, username=$2, avatar=COALESCE($3, avatar)
      WHERE id=$4
      RETURNING *
    `;
    const values = [name, username, avatarUrl, user.id];
    const result = await pool.query(query, values);

    res.json({
      name: result.rows[0].name,
      username: result.rows[0].username,
      avatar: result.rows[0].avatar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Update profile route
app.put("/updateProfile", upload.single("avatar"), async (req, res) => {
  console.log("Update profile attempt:", req.body);

  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Not logged in" });

    const { name, username } = req.body;

    let avatarUrl = null;

    // 1️⃣ Get existing user data from Postgres
    const userResult = await pool.query(
      "SELECT avatar FROM clients WHERE id=$1",
      [user.id],
    );

    if (userResult.rowCount === 0)
      return res.status(404).json({ error: "User not found" });

    const existingAvatar = userResult.rows[0].avatar;

    // 2️⃣ If new file uploaded, delete old from Supabase and upload new
    if (req.file) {
      if (req.file && existingAvatar) {
        try {
          let filePath = existingAvatar; // e.g., "https://…/profile-pictures/RS-1774816441975.png" or "/RS-1774816441975.png"

          // 1️⃣ Remove the full URL if stored
          if (filePath.startsWith("http")) {
            const parts = filePath.split("/");
            filePath = parts[parts.length - 1]; // Keep only the file name
          }

          // 2️⃣ Remove any leading slashes (just in case)
          filePath = filePath.replace(/^\/+/, "");

          console.log("Deleting old avatar from Supabase at path:", filePath);

          // 3️⃣ Delete from Supabase bucket
          const { data, error: deleteError } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .remove([filePath]); // must pass as array

          if (deleteError) {
            console.error("Supabase deletion failed:", deleteError);
          } else {
            console.log("Old avatar deleted successfully:", data);
          }
        } catch (err) {
          console.error("Unexpected error during deletion:", err);
        }
      }
      // Upload new picture
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${username}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(filePath, req.file.buffer, {
          upsert: true,
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(filePath);

      avatarUrl = data.publicUrl;
    }
    console.log("New avatar URL:", avatarUrl);
    // 3️⃣ Update Postgres user
    const updateQuery = `
      UPDATE clients
      SET name=$1,
          username=$2,
          avatar=COALESCE($3, avatar)
      WHERE id=$4
      RETURNING name, username, avatar
    `;
    const values = [name, username, avatarUrl, user.id];

    const updateResult = await pool.query(updateQuery, values);

    res.json({
      avatar: updateResult.rows[0].avatar,
      name: updateResult.rows[0].name,
      username: updateResult.rows[0].username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

//testimonial

app.post("/addTestimonial", upload.single("image"), async (req, res) => {
  try {
    const user = getUserFromToken(req);
    console.log("Authenticated user for testimonial:", user);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { name, message, link } = req.body;
    console.log("Received testimonial data:", { name, message, link });
    let imageUrl = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // Insert into Postgres
    const query = `
      INSERT INTO testimonial (user_id, name, message, link, image_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [user.id, name, message, link, imageUrl];
    const { data, error } = await pool.query(query, values);

    if (error) throw error;

    res.json({ success: true, testimonial: data });
    console.log("New testimonial added:", data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

// user count
app.get("/count", async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const result = await pool.query("SELECT COUNT(*) FROM clients");

    const count = parseInt(result.rows[0].count);

    res.json({ totalUsers: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== ADMIN VERIFY =====
app.post("/verifyAdmin", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  const { code } = req.body;
  if (code === process.env.ADMIN_CODE) return res.sendStatus(200);
  return res.status(401).json({ error: "Invalid code" });
});

// ===== ADD PROJECT =====
app.post("/addProject", upload.array("images"), async (req, res) => {
  console.log("Add project attempt:", req.body);
  const user = getUserFromToken(req);
  console.log("Authenticated user:", user);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  try {
    const { name, description, techStack, liveLink, githubLink } = req.body;

    let parsedTechStack;

    if (typeof techStack === "string") {
      try {
        parsedTechStack = JSON.parse(techStack);
      } catch (err) {
        console.log("❌ Failed parsing:", techStack);
        return res.status(400).json({ error: "Invalid techStack JSON" });
      }
    } else {
      parsedTechStack = techStack;
    }

    const files = req.files; // Array of images

    // ===== Upload images to Supabase =====
    const uploadedUrls = [];
    for (let file of files) {
      const fileName = `${Date.now()}_${file.originalname}`;
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const publicUrl = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(fileName).data.publicUrl;

      uploadedUrls.push(publicUrl);
    }

    // after parsing techStack
    // after uploading images

    console.log("RAW techStack:", techStack);
    console.log("PARSED techStack:", parsedTechStack);
    console.log("TYPE:", typeof parsedTechStack);
    console.log("IS ARRAY:", Array.isArray(parsedTechStack));

    console.log("IMAGES:", uploadedUrls);

    if (!Array.isArray(parsedTechStack)) {
      return res.status(400).json({ error: "techStack must be array" });
    }

    // ===== Insert project into Postgres =====
    const query = `
      INSERT INTO projects (name, description, tech_stack, live_link, github_link, images)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [
      name,
      description,
      JSON.stringify(parsedTechStack), // store as JSON string
      liveLink,
      githubLink,
      JSON.stringify(uploadedUrls), // store array of image URLs as JSON string
    ];
    const result = await pool.query(query, values);
    console.log("New project added:", result.rows[0]);
    res.json({ success: true, project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const emailTemplate = (firstName) => {
  return `<!DOCTYPE html><html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, sans-serif;
      color: #e2e8f0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #111827;
      border-radius: 10px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #0f172a, #1e293b);
      padding: 20px;
      text-align: left;
      font-size: 22px;
      font-weight: bold;
      color: #38bdf8;
      
    }
    
    .content {
      padding: 25px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background: #38bdf8;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head><body>
  <div class="container"><!-- HEADER -->
<div class="header">
<h2>AlexSite 🚀</h2>
  
</div>

<!-- CONTENT -->
<div class="content">
  <h2>Hello <span style="color:#38bdf8; font-weight:bold;">${firstName},</span></h2>

  <p>
    Thanks for reaching out to us. We've received your message and our team will review it shortly and get back to you.
  </p>

  <p>
    We’ll get back to you as soon as possible. We appreciate your interest in working with us.
  </p>

  <a href="#" class="button">Visit Website</a>
</div>

<!-- FOOTER -->
<div class="footer">
  © 2026 AlexSite. All rights reserved.
</div>

  </div>
</body>
</html>`;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "alexsite090702@gmail.com", pass: "vxgjgtcqdqhpncyn" },
});

app.post("/request", async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  const { firstName, middleName, email, subject, message } = req.body;

  console.log(user);
  console.log("Received request:", {
    firstName,
    middleName,
    email,
    subject,
    message,
  });
  const userId = user.id;

  try {
    await pool.query(
      "INSERT INTO request(fist_name,middle_name,email,subject,message,user_id) VALUES($1,$2,$3,$4,$5,$6)",
      [firstName, middleName, email, subject, message, userId],
    );

    // email to YOU
    await transporter.sendMail({
      from: "AlexSite",
      to: "alexsite090702@gmail.com",
      subject: "New request",
      replyTo: email,
      text: `${firstName} ${middleName}\n${email}\n${subject}\n${message}`,
    });

    // auto reply
    await transporter.sendMail({
      from: "AlexSite",
      to: email,
      subject: "We got your message 🚀",
      html: emailTemplate(firstName),
    });

    res.status(200).json({ message: firstName });
    console.log(firstName);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* ------------------- Auth Check ------------------- */

app.get("/auth-check", (req, res) => {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({ message: "Authenticated" });
});
/* ------------------- Logout ------------------- */
app.post("/logout", (req, res) => {
  try {
    // Get token from Authorization header (optional)
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // For normal JWT, we just tell client to delete it
    // If you want, you can implement a blacklist here

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
});

// GET CURRENT USER
app.get("/me", async (req, res) => {
  const user = getUserFromToken(req);
  const r = await pool.query("SELECT * FROM clients WHERE id=$1", [user.id]);
  console.log("Current user query result:", r.rows[0]);
  res.json(r.rows[0]);
});

// GET USERS (ADMIN)
app.get("/users", async (req, res) => {
  const r = await pool.query("SELECT id,name,avatar FROM clients");
  res.json(r.rows);
});

// GET MESSAGES
app.get("/messages/:id", async (req, res) => {
  const id = req.params.id;

  const r = await pool.query(
    `
    SELECT * FROM messages
    WHERE (sender_id=$1 AND receiver_id='admin')
    OR (sender_id='admin' AND receiver_id=$1)
    ORDER BY timestamp ASC
  `,
    [id],
  );

  res.json(r.rows);
});

// SOCKET
io.on("connection", (socket) => {
  console.log("CONNECTED");

  socket.on("join", (id) => {
    socket.join(id);
  });

  socket.on("send", async (d) => {
    console.log("SEND:", d);

    const r = await pool.query(
      "INSERT INTO messages(sender_id,receiver_id,message,timestamp) VALUES($1,$2,$3,NOW()) RETURNING *",
      [d.from, d.to, d.text],
    );

    io.to(d.to).emit("receive", r.rows[0]);
    io.to(d.from).emit("receive", r.rows[0]);
  });
});

// ------------------- START SERVER ------------------- //
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
