const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json("No token");

  // support both raw token and Bearer token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = decoded;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};