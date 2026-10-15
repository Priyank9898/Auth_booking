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

  let bookingUpdate;

  try {
    bookingUpdate = await pool.query(
      `UPDATE seats
     SET name = $1,
         isbooked = $2,
         booked_by_user_id = $3
     WHERE id = $4`,
      [userName, 1, userId, seatId],
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }

  return res.status(201).json({
    msg: bookingUpdate,
    // msg: `Congratulations the seats are booked with id: ${}`,
  });
};

export { availableSeats, seatBooking };
