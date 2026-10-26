const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

let isSystemFrozen = false;
let centralLiquidity = 5000000;

let customerAccounts = [
  { id: "usr_1", name: "Alex Mercer", email: "alex@bank.com", role: "customer", status: "active", balance: 12450.75 },
  { id: "usr_2", name: "Sarah Chen", email: "sarah@bank.com", role: "customer", status: "active", balance: 8900.00 },
  { id: "usr_3", name: "Marcus Brody", email: "marcus@bank.com", role: "customer", status: "flagged", balance: 450.00 }
];

// Admin restricted: Get bank overview
router.get("/overview", (req, res) => {
  res.json({
    totalLiquidity: centralLiquidity,
    activeAccounts: customerAccounts.length,
    systemFrozen: req.app ? req.app.get("systemFrozen") : isSystemFrozen,
    users: customerAccounts
  });
});

// Admin restricted: Toggle circuit breaker
router.post("/freeze-system", authenticateToken, requireRole(["admin"]), (req, res) => {
  const { frozen } = req.body;
  isSystemFrozen = Boolean(frozen);
  if (req.app) {
    req.app.set("systemFrozen", isSystemFrozen);
    const io = req.app.get("io");
    if (io) {
      io.emit("circuitBreakerAlert", {
        frozen: isSystemFrozen,
        sender: req.user.email,
        timestamp: new Date().toISOString()
      });
    }
  }

  res.json({
    message: isSystemFrozen ? "Circuit breaker triggered: Transactions frozen." : "Circuit breaker lifted: Transactions operational.",
    systemFrozen: isSystemFrozen
  });
});

// Admin restricted: Inject liquidity
router.post("/inject-liquidity", authenticateToken, requireRole(["admin"]), (req, res) => {
  const { amount } = req.body;
  const val = Number(amount);
  if (!val || val <= 0) {
    return res.status(400).json({ error: "Invalid injection amount." });
  }
  centralLiquidity += val;
  res.json({
    message: `Injected $${val.toLocaleString()} into central reserves.`,
    totalLiquidity: centralLiquidity
  });
});

// Admin restricted: Toggle KYC status
router.post("/toggle-status", authenticateToken, requireRole(["admin"]), (req, res) => {
  const { userId } = req.body;
  const user = customerAccounts.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User record not found." });
  }
  user.status = user.status === "active" ? "locked" : "active";
  res.json({ message: `User status set to ${user.status}`, user });
});

module.exports = router;
module.exports.isSystemFrozen = () => isSystemFrozen;
