const mongoose = require("mongoose");

const TradingSchema = new mongoose.Schema(
  {
    onGoingTrade: { type: Boolean },
    messages: { type: Array },
    users: [
      {
        user: { type: String },
        user_id: { type: String, unique: true },
        username: { type: String },
        initiateTrade: { type: Boolean },
        confirmTrade: { type: Boolean },
        cards: { type: Array },
      },
      {
        user_id: { type: String, unique: true },
        username: { type: String },
        confirmTrade: { type: Boolean },
        cards: { type: Array },
      },
    ],
  },
  { collection: "trading" }
);
const model = mongoose.model("TradingSchema", TradingSchema);

module.exports = model;
