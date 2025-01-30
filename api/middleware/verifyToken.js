import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Token received:", req.cookies.token); // Log token

  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    req.userId = payload.id; // Attach user ID to request
    console.log("Payload:", payload); // Log payload for debugging
    next();
  });
};

