import 'dotenv/config'
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import Message from "./models/message.js";
import User from "./models/user.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Make sure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Serve uploaded images publicly
app.use("/uploads", express.static("uploads"));

// USER REGISTER / LOGIN route

app.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilePic = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password, profilePic });
    res.json({ user });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    res.json(user);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find({}, { name: 1, profilePic: 1, email: 1 });
  res.json(users);
});

// SOCKET.IO CHAT HANDLING

const users = {};

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("register_user", (email) => {
    users[email] = socket.id;
    console.log("Registered user:", email);
  });

  socket.on("send_message", async (data) => {
    const { from, to, message } = data;
    try {
      const msg = await Message.create({ from, to, message });
      const receiverSocket = users[to];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", data);
      }
    } catch (err) {
      console.error("Message Error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const email in users) {
      if (users[email] === socket.id) {
        delete users[email];
        break;
      }
    }
  });
});

server.listen(process.env.PORT, () => console.log("🚀 Server running on port 5000"));
