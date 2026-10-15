import pool from "../db/pool.mjs";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils.mjs";
import { strictObject } from "zod";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email],
  );
  if (existingUser.rowCount > 0) {
    throw new Error("User already exist");
  }

  //* Password hash
  const passwordHash = await bcrypt.hash(password, 12);

  const results = await pool.query(
    `INSERT INTO users (name,email,password_hash)
      VALUES($1,$2,$3)
      RETURNING id, name, email, created_at`,
    [name, email, passwordHash],
  );

  return res.status(201).json({
    msg: "Registration completed",
    data: results.rows[0],
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      error: "All fields are required",
    });
  }

  const userLookUp = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  // userLookUp
  if (userLookUp.rowCount === 0) {
    return res.status(401).json({
      error: "Email or password incorrect",
    });
  }

  const user = userLookUp.rows[0];

  //Password comparison
  const passwordCheck = await bcrypt.compare(password, user.password_hash);

  if (!passwordCheck) {
    return res.status(401).json({
      error: "Email or password incorrect",
    });
  }

  // Adding access and refresh token in DB
  const accessToken = generateAccessToken({
    id: user.id,
    name: user.name,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  const dbTokenUpdate = await pool.query(
    `UPDATE users
    SET access_token = $1,
        refresh_token = $2
    WHERE id = $3
    `,
    [accessToken, refreshToken, user.id],
  );

  if (dbTokenUpdate.rowCount === 0)
    return res.status(400).json({
      msg: "Access Token and Refresh Token could not be added",
    });

  res.cookie("refreshToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: `Login successful`,
    user: {
      id: user.id,
      email: user.email,
      accessToken: accessToken,
    },
  });
};

export { register, login };
