import express from "express";
import { login, register } from "../../controllers/Auth/auth.controller.js";

const router = express.Router();

// Bejelentkezés (publikus)
router.post("/login", login);
// Regisztráció (publikus)
router.post("/register", register);

export default router;
