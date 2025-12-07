const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    brand_name: {
      type: String,
      required: false
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    stock_quantity: {
      type: Number,
      required: true
    },
    regular_price: {
      type: Number,
      required: true
    },
    sale_price: {
      type: Number,
      required: false
    },
    tags: {
      type: String,
      required: false
    },
    variants: {
      type: Object,
      required: false
    },
    photo: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
