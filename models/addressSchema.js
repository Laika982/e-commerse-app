const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    company_name: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zip_code: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone_number: {
      type: String,
      required: true
    },
    addressType: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
