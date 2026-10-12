import pool from "../db/pool.mjs";
import bcrypt from "bcrypt";

/**
 * * Registration
 * check if user exists or not?
 * hash password and save the necessary info inside the DB
 * at the end sends user confirmation if DB save is done successfully
 */

const register = async (req, res) => {
  const { name, email, password } = req.body;
  //? existing user
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

const login = async ({ email, password }) => {};

export { register };
