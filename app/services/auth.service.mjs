import pool from "../db/pool.mjs";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new Error("All fields are required");

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

const login = async (req, body) => {
  const { email, password } = req.body;
};

export { register, login };
