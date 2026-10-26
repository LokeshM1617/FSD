let mongoose;
try {
  mongoose = require("mongoose");
} catch {
  mongoose = null;
}

if (mongoose && mongoose.Schema) {
  const transactionSchema = new mongoose.Schema(
    {
      sender: { type: String, required: true },
      recipient: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ["Transfer", "Deposit", "Withdrawal", "Escrow"], default: "Transfer" },
      category: { type: String, default: "Transfer" },
      description: { type: String, default: "" },
      status: { type: String, default: "completed" }
    },
    { timestamps: true }
  );

  module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
} else {
  module.exports = {};
}
