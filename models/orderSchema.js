const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    total_price: {
      type: Number,
      required: true
    },
    delivery_number: {
      type: String,
      required: false
    },
    order_status: {
      type: String,
      required: true
    },
    payment_method: {
      type: String,
      required: true
    },
    shipping_method: {
      type: String,
      required: true
    },
    rewards_used: {
      type: Number,
      required: false
    },
    coupon_code: {
      type: String,
      required: false
    },
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
