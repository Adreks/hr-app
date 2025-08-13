import express from "express";
import userRoutes from "./User/user.routes.js";

const router = express.Router();

// Fő API router: minden user-rel kapcsolatos route-ot beköt
router.use("/users", userRoutes);
// Ide lehet további route-okat (pl. /products) bekötni

export default router;
