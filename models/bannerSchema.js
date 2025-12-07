const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    description: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
