const mongoose = require("mongoose");

const cards = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    rarity: { type: String },
    image: { type: String },
    favorite: { type: Boolean },
    exchangeable: { type: Boolean },
    inStock: { type: Boolean },
  },
  { collection: "cards" }
);

const model = mongoose.model("cards", cards);
module.exports = model;
