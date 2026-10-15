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

// We are expecting here that FE will provide the seat that user requires

const seatBooking = async (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;
  const seatId = req.params.id;

  const conn = await pool.connect();

  try {
    await conn.query("BEGIN");

    const bookingUpdate = await conn.query(
      `UPDATE seats
       SET name = $1,
           isbooked = $2,
           booked_by_user_id = $3
       WHERE id = $4
         AND isbooked = 0
       RETURNING id, name, isbooked, booked_by_user_id`,
      [userName, 1, userId, seatId],
    );

    if (bookingUpdate.rowCount === 0) {
      await conn.query("ROLLBACK");

      return res.status(409).json({
        msg: "Seat is already booked or does not exist",
      });
    }

    await conn.query("COMMIT");

    return res.status(200).json({
      msg: "Seat booked successfully",
      seat: bookingUpdate.rows[0],
    });
  } catch (err) {
    await conn.query("ROLLBACK");
    console.error(err);

    return res.status(500).json({
      msg: "Something went wrong",
    });
  } finally {
    conn.release();
  }
};

export { availableSeats, seatBooking };
