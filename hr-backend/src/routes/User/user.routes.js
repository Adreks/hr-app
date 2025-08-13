import express from "express";
import { authenticate } from "../../controllers/Auth/auth.controller.js";
import {
  forgotPassword,
  resetPassword,
} from "../../controllers/User/forgotPassword.controller.js";
import {
  deleteUserById,
  getAllUsers,
  getCurrentUser,
  getUsers,
  register,
  updateCurrentUser,
  updateUserById,
} from "../../controllers/User/user.controller.js";
import { checkRole } from "../../services/Auth/auth.service.js";

const router = express.Router();

// Regisztráció (publikus)
router.post("/register", register);
// Publikus user lista (keresés/lapozás)
router.get("/", getUsers);
// Saját profil lekérdezése (auth szükséges)
router.get("/myprofile", authenticate, getCurrentUser);
// Saját profil szerkesztése (auth szükséges)
router.put("/myprofile", authenticate, updateCurrentUser);
// Csak admin: összes user (keresés/lapozás, admin funkciók)
router.get("/all", authenticate, checkRole("admin"), getAllUsers);
// Jelszó-visszaállítás indítása (publikus)
router.post("/forgot-password", forgotPassword);
// Jelszó-visszaállítás végrehajtása (publikus)
router.post("/reset-password", resetPassword);
// Csak admin: bármely user szerkesztése
router.put("/:id", authenticate, checkRole("admin"), updateUserById);
// Csak admin: bármely user törlése
router.delete("/:id", authenticate, checkRole("admin"), deleteUserById);

export default router;
