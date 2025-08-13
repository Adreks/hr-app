import jwt from "jsonwebtoken";

// JWT token generálása a user adataiból
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  // Titkos kulcs a környezeti változóból
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

// Middleware: csak akkor engedélyezi a műveletet, ha a user role-ja egyezik a megadottal
export const checkRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    const error = new Error("Forbidden, insufficient role");
    error.status = 403;
    return next(error);
  }
  next();
};
