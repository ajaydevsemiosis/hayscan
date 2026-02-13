"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.get("/profile", auth_1.verifyToken, userController_1.getProfile);
router.put("/profile", auth_1.verifyToken, upload_1.upload.single("image_path"), userController_1.updateProfile);
exports.default = router;
