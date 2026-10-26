const express = require("express");
const router = express.Router();
const { JWT_SECRET } = require("../middleware/authMiddleware");

let jwt;
try {
  jwt = require("jsonwebtoken");
} catch {
  jwt = null;
}

// In-memory demo credentials matching SecureBank specifications
const DEMO_USERS = [
  { id: "usr_1", name: "Alex Mercer", email: "alex@bank.com", password: "password123", role: "customer", balance: 12450.75 },
  { id: "usr_2", name: "Sarah Chen", email: "sarah@bank.com", password: "password123", role: "customer", balance: 8900.00 },
  { id: "usr_admin", name: "Super Admin", email: "admin@bank.com", password: "adminpassword", role: "admin", balance: 100000.00 }
];

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  let token = "mock_token_" + Buffer.from(JSON.stringify(payload)).toString("base64");
  if (jwt) {
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
  }

  res.status(200).json({
    message: "Authentication successful",
    token,
    user: payload
  });
});

module.exports = router;
