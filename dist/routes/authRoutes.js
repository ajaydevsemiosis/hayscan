"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post("/register", upload_1.upload.single("image_path"), authController_1.register);
router.post("/login", authController_1.loginOrRegisterWithPhone);
exports.default = router;
