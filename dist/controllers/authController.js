"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOrRegisterWithPhone = exports.register = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// REGISTER
const register = async (req, res) => {
    try {
        const { name, company_name, designation, email, website, phone_number, address, category, password, } = req.body;
        const image_path = req.file ? req.file.filename : null;
        if (!password) {
            return res.status(400).json({
                message: "Password required",
                status: false,
                data: {}
            });
        }
        // email already exists check
        const [check] = await db_1.db.execute("SELECT id FROM users WHERE email=?", [email]);
        if (check.length > 0) {
            return res.status(400).json({
                message: "Email already registered",
                status: false,
                data: {}
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const [result] = await db_1.db.execute(`INSERT INTO users 
      (name, company_name, designation, email, website, phone_number, address, category, image_path, password, created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,NOW())`, [
            name,
            company_name,
            designation,
            email,
            website,
            phone_number,
            address,
            category,
            image_path,
            hashedPassword,
        ]);
        const fullImagePath = image_path
            ? `${req.protocol}://${req.get("host")}/uploads/${image_path}`
            : null;
        res.json({
            message: "User registered successfully",
            status: true,
            data: {
                id: result.insertId,
                name,
                email,
                image_path: fullImagePath
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            status: false,
            data: {}
        });
    }
};
exports.register = register;
const loginOrRegisterWithPhone = async (req, res) => {
    try {
        const { phone_number } = req.body;
        if (!phone_number) {
            return res.status(400).json({
                message: "Phone number is required",
                status: false,
                data: {}
            });
        }
        const [rows] = await db_1.db.execute("SELECT * FROM users WHERE phone_number = ? LIMIT 1", [phone_number]);
        let user = rows[0];
        // 🆕 Register if not exists
        if (!user) {
            const [result] = await db_1.db.execute("INSERT INTO users (phone_number, created_at) VALUES (?, NOW())", [phone_number]);
            const [newUserRows] = await db_1.db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [result.insertId]);
            user = newUserRows[0];
        }
        // 🔑 Generate token
        const token = jsonwebtoken_1.default.sign({ id: user.id, phone_number: user.phone_number }, process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" });
        // 🖼️ Full image path
        const fullImagePath = user.image_path
            ? `${req.protocol}://${req.get("host")}/uploads/${user.image_path}`
            : null;
        return res.json({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                company_name: user.company_name,
                designation: user.designation,
                website: user.website,
                phone_number: user.phone_number,
                address: user.address,
                category: user.category,
                image_path: fullImagePath,
                is_new_user: rows.length === 0
            },
            token,
            message: "Login successful",
            status: true,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error",
            status: false,
            data: {}
        });
    }
};
exports.loginOrRegisterWithPhone = loginOrRegisterWithPhone;
