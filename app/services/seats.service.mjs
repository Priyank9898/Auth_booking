import pool from "../db/pool.mjs";

const availableSeats = async (req, res) => {
  let seats;

  try {
    seats = await pool.query(
      `SELECT id,isbooked FROM seats
        WHERE isbooked=$1
        `,
      [0],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }

  if (seats.rowCount === 0) {
    return res.status(200).json({
      msg: "All seats are booked",
    });
  }

  return res.status(200).json({
    msg: seats.rows,
  });
};

export { availableSeats };
