import express from "express";
import { loginOrRegisterWithPhone, register } from "../controllers/authController";
import { upload } from "../middleware/upload";


const router = express.Router();

router.post("/register", upload.single("image_path"), register);
router.post("/login", loginOrRegisterWithPhone);

export default router;
