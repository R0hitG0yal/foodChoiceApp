const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://rgoyal4122:7699@cluster0.xk2cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" // Your mongoDB URL here
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error", err));

// CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change this to your client's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const authRoutes = require("./routes/auth");
const dishRoutes = require("./routes/dish.js");

app.use(cors());
app.use(express.json());

// Serve the 'uploads' folder as a static directory
app.use("/uploads", express.static("uploads"));

// Socket.io middleware to attach io to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dish", dishRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("dishMoved", (data) => {
    io.emit("updateDish", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
