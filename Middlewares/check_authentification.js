import jwt from "jsonwebtoken";

const SECRET = process.env.APP_SECRET;

/**
 * Middleware to verify JWT token and authenticate a user.
 * @param {Object} req - Express request object containing headers
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const check_auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(403).json({ msg: "No token" });
    }

    // Extraire le token après "Bearer "
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "No token" });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, msg: "Auth failed: " + err.message });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ msg: "Auth failed: " + error.message });
  }
};

export default check_auth;
