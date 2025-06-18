import express from "express";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import JWT_SECRET from "./config.js";
import { z, ZodError } from "zod";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3100",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// JWT middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(403);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const userSchema = z.object({
  name: z.string().min(2).max(20),
  username: z.string().email(),
  password: z.string().min(2),
});

// ✅ Fixed Sign up route
app.post("/signup", async (req, res) => {
  try {
    const { name, username, password } = userSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token });
    console.log("Sign up done");
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ msg: error.errors[0]?.message || "Invalid input" });
    }

    if (error.code === "P2002" && error.meta?.target?.includes("username")) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    console.error("Error @ signup:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Sign in
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

// Search users
app.get("/users", authenticateJWT, async (req, res) => {
  const { search } = req.query;
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ],
    },
  });
  res.json(users);
});

// Get user details
app.get("/user/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  res.json(user);
});

// Get messages
app.get("/messages/:userId", authenticateJWT, async (req, res) => {
  const { userId } = req.params;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

// Create message
app.post("/messages", authenticateJWT, async (req, res) => {
  const { receiverId, content } = req.body;
  const message = await prisma.message.create({
    data: {
      senderId: req.user.id,
      receiverId,
      content,
    },
  });

  io.to(receiverId).emit("newMessage", message);
  res.json(message);
});

// Get current user
app.get("/current-user", authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch current user" });
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  socket.on("join", ({ userId }) => {
    socket.join(userId);
  });

  socket.on("sendMessage", async (message) => {
    const { senderId, receiverId, content } = message;
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    io.to(receiverId).emit("newMessage", newMessage);
    io.to(senderId).emit("newMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start server
server.listen(4000, () => {
  console.log("🚀 Server is running on http://localhost:4000");
});
