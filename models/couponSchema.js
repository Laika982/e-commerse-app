const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    coupon_code: {
      type: String,
      required: true,
      unique: true
    },
    coupon_name: {
      type: String,
      required: true
    },
    coupon_type: {
      type: String,
      required: true
    },
    discount_value: {
      type: Number,
      required: true
    },
    applies_items: {
      type: String,
      required: false
    },
    duration_date: {
      type: Date,
      required: true
    },
    usage_limit: {
      type: Number,
      required: false
    },
    status: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
