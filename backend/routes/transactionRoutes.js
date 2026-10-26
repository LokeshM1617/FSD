const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const userRoutes = require("./userRoutes");

let memoryTransactions = [
  {
    _id: "tx-101",
    sender: "alex@bank.com",
    recipient: "sarah@bank.com",
    amount: 250,
    type: "Transfer",
    category: "Transfer",
    description: "Cloud Server Subscription",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: "tx-102",
    sender: "Employer Payroll",
    recipient: "alex@bank.com",
    amount: 1500,
    type: "Deposit",
    category: "Payroll",
    description: "Direct Deposit Bi-weekly",
    status: "completed",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// GET transactions
router.get("/", authenticateToken, (req, res) => {
  res.json(memoryTransactions);
});

// POST transaction (with Circuit Breaker check)
router.post("/", authenticateToken, (req, res) => {
  const isFrozen = (req.app && req.app.get("systemFrozen")) || userRoutes.isSystemFrozen();
  if (isFrozen) {
    return res.status(403).json({
      error: "CIRCUIT_BREAKER_ACTIVE",
      message: "TRANSACTION REJECTED: Banking transactions are currently frozen by administrator."
    });
  }

  const { recipient, amount, category, description } = req.body;
  const numAmount = parseFloat(amount);
  if (!recipient || !numAmount || numAmount <= 0) {
    return res.status(400).json({ error: "Recipient and valid amount are required." });
  }

  const newTx = {
    _id: "tx-" + Date.now(),
    sender: req.user ? req.user.email : "customer@bank.com",
    recipient,
    amount: numAmount,
    type: "Transfer",
    category: category || "Transfer",
    description: description || "Direct Wire Transfer",
    status: "completed",
    createdAt: new Date().toISOString()
  };

  memoryTransactions.unshift(newTx);

  if (req.app) {
    const io = req.app.get("io");
    if (io) {
      io.emit("newTransaction", newTx);
    }
  }

  res.status(201).json(newTx);
});

module.exports = router;
