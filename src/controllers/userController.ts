import { Request, Response } from "express";
import { db } from "../config/db";


// GET PROFILE
export const getProfile = async (req: any, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      `SELECT 
      id,
      name,
      company_name,
      designation,
      email,
      website,
      phone_number,
      address,
      category,
      image_path,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM users WHERE id=?`,
      [req.user.id]
    );

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
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message || "Something went wrong",
      status: false,
      data: {}
    });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    console.log('req',req.user);
    const {
      name,
      company_name,
      designation,
      email,
      website,
      address,
      category,
      phone_number,
    } = req.body;

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
      phone_number,
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
      phone_number,
      req.user.id,
    ].map(v => (v === undefined ? null : v));

    if (image_path) {
      await db.execute(
        `UPDATE users SET
          name=?,
          company_name=?,
          designation=?,
          email=?,
          website=?,
          address=?,
          category=?,
          image_path=?,
          phone_number=?
        WHERE id=?`,
        valuesWithImage
      );
    } else {
      await db.execute(
        `UPDATE users SET
          name=?,
          company_name=?,
          designation=?,
          email=?,
          website=?,
          address=?,
          category=?,
          phone_number=?
        WHERE id=?`,
        valuesWithoutImage
      );
    }

    const [rows]: any = await db.execute(
      `SELECT id,
      name,
      company_name,
      designation,
      email,
      website,
      phone_number,
      address,
      category,
      image_path,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM users WHERE id=?`,
      [req.user.id]
    );

    const user = rows[0];

    user.image_path = user.image_path
      ? `${req.protocol}://${req.get("host")}/uploads/${user.image_path}`
      : null;

    res.json({
      data: user,
      message: "Profile updated successfully",
      status: true,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Something went wrong",
      status: false,
      data: {}
    });
  }
};

export const addUserCard = async (req: any, res: Response) => {
  try {
    const {
      name,
      company_name,
      designation,
      email,
      website,
      phone_number,
      address,
      category,
    } = req.body;

    const values = [
      req.user.id,     // user_id (from JWT)
      name || null,
      company_name || null,
      designation || null,
      email || null,
      website || null,
      phone_number || null,
      address || null,
      category || null,
    ];

    const [result]: any = await db.execute(
      `INSERT INTO user_cards 
        (user_id, name, company_name, designation, email, website, phone_number, address, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const [rows]: any = await db.execute(
      "SELECT id,name, company_name, designation, email, website, phone_number, address, category,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM user_cards WHERE id = ?",
      [result.insertId]
    );

    res.json({
      data: rows[0],
      status: true,
      message: "Card added successfully",
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: err.message || "Something went wrong",
      data: {},
    });
  }
};

export const updateUserCard = async (req: any, res: Response) => {
  try {
    const cardId = req.params.id;

    const {
      name,
      company_name,
      designation,
      email,
      website,
      phone_number,
      address,
      category,
    } = req.body;

    // ✅ Ensure card belongs to logged-in user
    const [checkRows]: any = await db.execute(
      "SELECT id FROM user_cards WHERE id = ? AND user_id = ?",
      [cardId, req.user.id]
    );

    if (checkRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Card not found or not authorized",
        data: {},
      });
    }

    const values = [
      name ?? null,
      company_name ?? null,
      designation ?? null,
      email ?? null,
      website ?? null,
      phone_number ?? null,
      address ?? null,
      category ?? null,
      cardId,
      req.user.id,
    ];

    await db.execute(
      `UPDATE user_cards SET
        name=?,
        company_name=?,
        designation=?,
        email=?,
        website=?,
        phone_number=?,
        address=?,
        category=?
       WHERE id=? AND user_id=?`,
      values
    );

    const [rows]: any = await db.execute(
      "SELECT id,name, company_name, designation, email, website, phone_number, address, category,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at FROM user_cards WHERE id = ?",
      [cardId]
    );

    res.json({
      data: rows[0],
      status: true,
      message: "Card updated successfully",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: err.message || "Something went wrong",
      data: {},
    });
  }
};

export const listUserCards = async (req: any, res: Response) => {
  try {
    const [rows]: any = await db.execute(
    `SELECT 
      id,
      name,
      company_name,
      designation,
      email,
      website,
      phone_number,
      address,
      category,
      image_path,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
    FROM user_cards
    WHERE user_id = ?
    ORDER BY id DESC`,
    [req.user.id]
  );

    res.json({
      data: rows,
      status: true,
      message: "Card list fetched successfully",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: err.message || "Something went wrong",
      data: [],
    });
  }
};

