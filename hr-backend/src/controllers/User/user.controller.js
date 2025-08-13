import bcrypt from "bcryptjs";
import { registerSchema } from "../../dto/User/userDTO.js";
import User from "../../models/User/user.model.js";
import { registerUser } from "../../services/User/user.service.js";

// User controller: felhasználók CRUD, profil, admin funkciók
// Minden authentikált user elérheti a saját profilját, admin az összes usert kezelheti

// Publikus user lista (keresés/lapozás támogatott)
export const getUsers = async (req, res, next) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ],
    };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query).skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(query);
    res.json({ users, total });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    // Validáció Joi-val
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Regisztrációs logika hívása
    const newUser = await registerUser(value);

    // Válasz (pl. user adatok vissza, de jelszó nélkül)
    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (err) {
    // Egyedi hiba kezelés (pl. duplikált user)
    if (err.message.includes("exists")) {
      return res.status(409).json({ message: err.message });
    }
    next(err);
  }
};

// Felhasználó módosítása
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Felhasználó törlése
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Authentikált user: saját profil lekérdezése
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId; // auth middleware beállítja

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Authentikált user: saját profil szerkesztése (név, avatar, jelszó)
export const updateCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található." });
    }
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.save();
    res.json({
      message: "Profil frissítve.",
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Hiba a profil frissítésekor." });
  }
};

// Csak admin: összes user (keresés/lapozás, admin funkciók)
export const getAllUsers = async (req, res, next) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ],
    };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query).skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(query);
    res.json({ users, total });
  } catch (err) {
    next(err);
  }
};

// Admin: bármely user szerkesztése (név, avatar, role)
export const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található." });
    }
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.role !== undefined) user.role = req.body.role;
    await user.save();
    res.json({
      message: "Felhasználó frissítve.",
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Hiba a felhasználó frissítésekor." });
  }
};

// Admin: bármely user törlése
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található." });
    }
    res.json({ message: "Felhasználó törölve." });
  } catch (err) {
    res.status(500).json({ message: "Hiba a felhasználó törlésekor." });
  }
};
