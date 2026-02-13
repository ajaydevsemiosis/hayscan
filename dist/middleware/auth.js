"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Token required" });
    }
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "secretkey");
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
