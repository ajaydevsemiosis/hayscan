"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const db_1 = require("../config/db");
// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const [rows] = await db_1.db.execute("SELECT * FROM users WHERE id=?", [req.user.id]);
        const user = rows[0];
        if (!user) {
            return res.json({
                message: "User not found",
                status: false,
                data: {}
            });
        }
        // full image path
        user.image_path = user.image_path
            ? `${req.protocol}://${req.get("host")}/uploads/${user.image_path}`
            : null;
        res.json({
            data: user,
            message: "Profile fetched successfully",
            status: true,
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
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { name, company_name, designation, email, website, address, category, } = req.body;
        const image_path = req.file ? req.file.filename : null;
        const valuesWithImage = [
            name,
            company_name,
            designation,
            email,
            website,
            address,
            category,
            image_path,
            req.user.id,
        ].map(v => (v === undefined ? null : v));
        const valuesWithoutImage = [
            name,
            company_name,
            designation,
            email,
            website,
            address,
            category,
            req.user.id,
        ].map(v => (v === undefined ? null : v));
        if (image_path) {
            await db_1.db.execute(`UPDATE users SET
          name=?,
          company_name=?,
          designation=?,
          email=?,
          website=?,
          address=?,
          category=?,
          image_path=?
        WHERE id=?`, valuesWithImage);
        }
        else {
            await db_1.db.execute(`UPDATE users SET
          name=?,
          company_name=?,
          designation=?,
          email=?,
          website=?,
          address=?,
          category=?
        WHERE id=?`, valuesWithoutImage);
        }
        const [rows] = await db_1.db.execute("SELECT * FROM users WHERE id=?", [req.user.id]);
        const user = rows[0];
        user.image_path = user.image_path
            ? `${req.protocol}://${req.get("host")}/uploads/${user.image_path}`
            : null;
        res.json({
            data: user,
            message: "Profile updated successfully",
            status: true,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
            status: false,
            data: {}
        });
    }
};
exports.updateProfile = updateProfile;
