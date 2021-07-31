const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    user_id: { type: String, unique: true },
    username: { type: String },
    inventory: { type: Array },
  },
  { collection: "inventory" }
);

const model = mongoose.model("InventorySchema", InventorySchema);

module.exports = model;
