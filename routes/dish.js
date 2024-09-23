const express = require("express");
const Dish = require("../models/Dish");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const router = express.Router();
const path = require("path");

// Multer storage config with filename and file validation for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".gif") {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

// Auth middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token is not valid" });
  }
};

// POST route to add a new dish
router.post(
  "/add",
  [authMiddleware, upload.single("image")],
  async (req, res) => {
    const { name, day } = req.body;
    try {
      const existingDish = await Dish.findOne({
        name,
        userId: req.user.userId,
      });
      if (existingDish) {
        return res.status(400).json({ message: "Dish already exists" });
      }

      const newDish = new Dish({
        name,
        image: req.file ? `/uploads/${req.file.filename}` : null, // Save relative path
        day,
        userId: req.user.userId,
      });

      await newDish.save();
      res.status(201).json(newDish);
    } catch (error) {
      console.error("Error adding dish:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET route to retrieve all dishes for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const dishes = await Dish.find({ userId: req.user.userId });
    res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route to move a dish to a new day
router.post("/move", authMiddleware, async (req, res) => {
  const { dishId, newDay } = req.body;
  try {
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    dish.day = newDay;
    await dish.save();

    // Emit WebSocket event for dish update
    req.io.emit("updateDish", dish);

    res.json(dish);
  } catch (error) {
    console.error("Error moving dish:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/move", authMiddleware, async (req, res) => {
  const { dishId, newDay } = req.body;
  try {
    const dish = await Dish.findById(dishId);
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    // Update the dish's day and save
    dish.day = newDay;
    await dish.save();

    // Emit WebSocket event to update all connected clients
    req.io.emit("updateDish", dish);

    res.json(dish);
  } catch (error) {
    console.error("Error moving dish:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route for dish search with debounced query
router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query;
  try {
    const dishes = await Dish.find({
      name: new RegExp(query, "i"),
      userId: req.user.userId,
    });
    res.json(dishes);
  } catch (error) {
    console.error("Error searching dishes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router
module.exports = router;
