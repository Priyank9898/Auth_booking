import pool from "../db/pool.mjs";
import bcrypt from "bcrypt";

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

  const userLookUp = await pool.query(
    `SELECT id, email, password_hash FROM users WHERE email = $1`,
    [email],
  );

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

  return res.status(200).json({
    message: `Login successful`,
    user: {
      id: user.id,
      email: user.email,
    },
  });
};

export { register, login };
