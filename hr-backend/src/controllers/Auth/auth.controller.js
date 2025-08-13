import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User/user.model.js";
import { generateToken } from "../../services/Auth/auth.service.js";

// Auth controller: regisztráció, bejelentkezés, JWT token kezelés, authenticate middleware

// POST /api/auth/login - bejelentkezés, JWT token visszaadása
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Ellenőrizzük, hogy van-e ilyen user email alapján
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Jelszó összehasonlítása
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Token generálása
    const token = generateToken(user);

    // Válasz visszaküldése a tokennel és user adatokkal
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/register - regisztráció, új user létrehozása
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Ellenőrizzük, hogy létezik-e már ilyen email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Új user létrehozása
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Token generálása és válasz visszaküldése
    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Middleware: authenticate - JWT token ellenőrzése, user azonosítása
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Missing authorization token");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    return next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
};
