import bcrypt from "bcrypt";
import User from "../../models/User/user.model.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({
  username,
  email,
  password,
  role = "user",
}) => {
  // Ellenőrzés, hogy van-e már user ezzel az emaillel vagy felhasználónévvel
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("User with given email or username already exists");
  }

  // Jelszó hash-elése
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Új user létrehozása és mentése
  const newUser = new User({ username, email, password: passwordHash, role });
  await newUser.save();

  return newUser;
};
