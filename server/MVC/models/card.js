const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  inventory: [
    {
      id: { type: String },
      name: { type: String },
      rarity: { type: String },
      image: { type: String },
    },
    { collection: "inventory" },
  ],
});

const model = mongoose.model("CardSchema", CardSchema);
module.exports = model;
