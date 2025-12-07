const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    card_number: {
      type: String,
      required: true,
      unique: true
    },
    expiry_date: {
      type: String,
      required: true
    },
    cvc: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
