import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../../models/User/user.model.js";

// Jelszó-visszaállítási controller
// forgotPassword: email alapján token generálás, resetPassword: token alapján új jelszó beállítása

// POST /api/users/forgot-password
// Email alapján token generálása, userhez mentése (teszt módban visszaadja a tokent)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Nincs ilyen e-mail címmel regisztrált felhasználó.",
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 óra
    await user.save();
    res.json({
      message:
        "Jelszó-visszaállítási e-mail elküldve (teszt módban csak token generálva).",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Hiba a jelszó-visszaállítás során." });
  }
};

// POST /api/users/reset-password
// Token és új jelszó alapján jelszó módosítása, token törlése
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Érvénytelen vagy lejárt token." });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Jelszó sikeresen megváltoztatva." });
  } catch (err) {
    res.status(500).json({ message: "Hiba a jelszó módosításakor." });
  }
};
