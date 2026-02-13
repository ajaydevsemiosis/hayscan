"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.get("/", (req, res) => {
    res.send("API Running 🚀");
});
app.listen(5000, '0.0.0.0', () => {
    console.log("Server running on port 5000");
});
