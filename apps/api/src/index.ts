import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/socket-events.types.js";
import { setupSocketHandlers } from "./handlers/socket-handlers.js";

// Configuration
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API info endpoint
app.get("/", (_req, res) => {
  res.json({
    name: "Quiz Buzzer API",
    version: "1.0.0",
    status: "running",
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.io server with types
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

// Setup socket handlers
setupSocketHandlers(io);

// Start server
httpServer.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎮  Quiz Buzzer API Server");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡  Server running on port ${PORT}`);
  console.log(`🔗  HTTP: http://localhost:${PORT}`);
  console.log(`🔌  WebSocket: ws://localhost:${PORT}`);
  console.log(`🌐  CORS enabled for: ${CLIENT_URL}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n🛑  SIGTERM received, shutting down gracefully...");
  httpServer.close(() => {
    console.log("✅  Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n🛑  SIGINT received, shutting down gracefully...");
  httpServer.close(() => {
    console.log("✅  Server closed");
    process.exit(0);
  });
});
