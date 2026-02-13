import express from "express";
import { updateProfile, getProfile, addUserCard, updateUserCard, listUserCards } from "../controllers/userController";
import { verifyToken } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, upload.single("image_path"), updateProfile);
router.post("/card", verifyToken, addUserCard);
router.put("/card/:id", verifyToken, updateUserCard);
router.get("/cards", verifyToken, listUserCards);

export default router;
