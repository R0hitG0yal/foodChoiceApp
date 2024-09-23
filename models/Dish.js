const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  day: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Dish = mongoose.model("Dish", dishSchema);
module.exports = Dish;
