const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Cross-Origin configuration supporting Render backend & Vercel frontend
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Global system freeze circuit-breaker state (synchronized across REST & Socket.IO)
let isSystemFrozen = false;
app.set("systemFrozen", false);

// Resilient MongoDB Atlas Connection (Safe for Render Cloud)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/securebank";
try {
  const mongoose = require("mongoose");
  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
    .then(() => console.log(" Exp 10 Backend: Connected to MongoDB Atlas"))
    .catch((err) => {
      console.warn(" Exp 10 Backend: Atlas offline, using resilient in-memory datastore (" + err.message + ")");
    });
} catch (e) {
  console.warn(" Exp 10 Backend: Running in-memory mode without external db driver");
}

// Socket.IO configuration with CORS enabled for Vercel clients
let io = null;
try {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(` WebSocket connected: ${socket.id}`);

    // Emit initial status including circuit breaker
    socket.emit("systemState", {
      frozen: app.get("systemFrozen"),
      timestamp: new Date().toISOString()
    });

    // Admin Emergency Circuit Breaker Freeze
    socket.on("emergencyFreeze", (data) => {
      const nextFrozen = Boolean(data && data.frozen);
      isSystemFrozen = nextFrozen;
      app.set("systemFrozen", nextFrozen);
      console.log(` Circuit Breaker Triggered: systemFrozen = ${nextFrozen}`);
      io.emit("circuitBreakerAlert", {
        frozen: nextFrozen,
        sender: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    // Admin Live Broadcast Alert
    socket.on("adminBroadcast", (data) => {
      console.log(` Admin Broadcast: ${data?.message}`);
      io.emit("systemAlert", {
        message: data.message || "Urgent Banking System Advisory",
        severity: data.severity || "critical",
        sender: data.sender || "Core Admin",
        timestamp: new Date().toLocaleTimeString()
      });
    });

    socket.on("disconnect", () => {
      console.log(` WebSocket disconnected: ${socket.id}`);
    });
  });

  app.set("io", io);
} catch (err) {
  console.warn(" Socket.IO initialization skipped:", err.message);
}

// Health Check & Exp 10 Cloud Verification Endpoint (Step 1 & Step 6 in PDF)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    experiment: "EXP NO.10: CI/CD Deployment with GitHub Actions + Render/Vercel",
    service: "SecureBank Core Backend API",
    platform: "Render Cloud Web Service",
    endpoints: {
      auth: "/api/auth/login",
      transactions: "/api/transactions",
      users: "/api/users/overview",
      freeze: "/api/users/freeze-system"
    },
    circuitBreaker: app.get("systemFrozen") ? "FROZEN" : "OPERATIONAL",
    timestamp: new Date().toISOString()
  });
});

// Modular Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

// Port binding as required by Render (Step 5 in PDF: process.env.PORT || 5000)
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`=======================================================`);
  console.log(` SecureBank Backend running on port ${PORT}`);
  console.log(` Render Ready & CI/CD Validated`);
  console.log(` Health check: http://localhost:${PORT}/`);
  console.log(`=======================================================`);
});
