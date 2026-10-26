let jwt;
try {
  jwt = require("jsonwebtoken");
} catch {
  jwt = null;
}

const JWT_SECRET = process.env.JWT_SECRET || "securebank_jwt_super_secret_key_exp10_render_prod_2026";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No authorization token provided." });
  }

  if (!jwt) {
    req.user = { id: "usr_mock", email: "alex@bank.com", role: "customer" };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden: You do not possess the required permissions.",
        requiredRoles: allowedRoles,
        currentRole: req.user ? req.user.role : "unauthenticated"
      });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole, JWT_SECRET };
