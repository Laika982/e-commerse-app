const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
