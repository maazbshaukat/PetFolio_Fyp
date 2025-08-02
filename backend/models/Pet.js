// backend/models/Pet.js
const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Dog', 'Cat', 'Bird'], required: true},
  vaccinated: { type: Boolean, default: false },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: [{ type: String, required: true }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Pet", PetSchema);
