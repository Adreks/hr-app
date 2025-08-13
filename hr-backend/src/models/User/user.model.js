import mongoose from "mongoose";

// User (felhasználó) séma: minden regisztrált user adatai
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // email egyedi azonosító
    },
    password: {
      type: String,
      required: true, // bcrypt hash-elt jelszó
    },
    role: {
      type: String,
      enum: ["user", "admin"], // jogosultsági szint
      default: "user",
    },
    resetPasswordToken: String, // jelszó-visszaállítás token
    resetPasswordExpires: Date, // token lejárati ideje
    name: {
      type: String,
      default: "", // felhasználó neve (opcionális)
    },
    avatar: {
      type: String,
      default: "", // avatar kép URL (opcionális)
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatikusan
  }
);

const User = mongoose.model("User", userSchema);
export default User;
