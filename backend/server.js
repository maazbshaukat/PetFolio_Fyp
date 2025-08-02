const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes.js");
const petRoutes = require("./routes/petRoutes.js");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require('./routes/adminRoutes');
const faqRoutes = require('./routes/faqRoutes');
const reviews = require ('./routes/reviews.js');



dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/reviews', reviews);



// Socket.IO Integration
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ Replace with your frontend origin in production
    methods: ["GET", "POST"],
  },
});

// Track connected users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Join personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("userOnline", userId);
    console.log(`🟢 User ${userId} joined their room`);
  });

  // Real-time message delivery
  socket.on("sendMessage", ({ receiverId, message }) => {
    console.log(`📤 Sending message to ${receiverId}`);
    io.to(receiverId).emit("receiveMessage", message); // ✅ key line
    io.to(receiverId).emit("chatCreated", message.chatId); 
  });

  // Typing indicators
  socket.on("typing", ({ receiverId }) => {
    io.to(receiverId).emit("typing", { from: socket.id });
  });

  socket.on("stopTyping", ({ receiverId }) => {
    io.to(receiverId).emit("stopTyping", { from: socket.id });
  });

  // Read receipt
  socket.on("messageRead", ({ chatId, readerId }) => {
    io.to(chatId).emit("messageRead", { chatId, readerId });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const userId = [...onlineUsers.entries()].find(([, id]) => id === socket.id)?.[0];
    if (userId) {
      onlineUsers.delete(userId);
      socket.broadcast.emit("userOffline", userId);
    }
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
