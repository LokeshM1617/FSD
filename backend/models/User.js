let mongoose;
try {
  mongoose = require("mongoose");
} catch {
  mongoose = null;
}

if (mongoose && mongoose.Schema) {
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["customer", "admin"], default: "customer" },
      balance: { type: Number, default: 10000 },
      status: { type: String, enum: ["active", "locked", "flagged"], default: "active" }
    },
    { timestamps: true }
  );

  module.exports = mongoose.models.User || mongoose.model("User", userSchema);
} else {
  module.exports = {};
}
