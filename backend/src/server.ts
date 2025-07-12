import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import cors from "cors";
import { db } from "./db/db";
import { swaps } from "./db/schema/index";
import { eq } from "drizzle-orm";

// ✅ Configure CORS middleware for Express
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  }),
);

// ✅ Create HTTP server
const httpServer = createServer(app);

// ✅ Initialize Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a room (swap-based chat room)
  socket.on("joinRoom", async (roomId) => {
    try {
      // Query swap to check status
      const swap = await db.select().from(swaps).where(eq(swaps.id, roomId));

      if (swap[0]?.status === "accepted") {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        socket.emit("joinedRoom", {
          roomId,
          message: "Joined room successfully",
        });
      } else {
        socket.emit("error", "Swap not accepted yet. Chat unavailable.");
      }
    } catch (err) {
      console.error("Join room error:", err);
      socket.emit("error", "Server error while joining room");
    }
  });

  // Handle sending messages
  socket.on("sendMessage", ({ roomId, message, sender }) => {
    socket.to(roomId).emit("receiveMessage", { message, sender });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
