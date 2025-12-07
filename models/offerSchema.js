const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    offer_id: {
      type: String,
      required: true,
      unique: true
    },
    offer_name: {
      type: String,
      required: true
    },
    offer_type: {
      type: String,
      required: true
    },
    discount_value: {
      type: Number,
      required: true
    },
    applied_to: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
