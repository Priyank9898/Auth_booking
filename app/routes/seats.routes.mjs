import { Router } from "express";
import authorize from "../middleware/authorize.middleware.mjs";
import * as booking from "../services/seats.service.mjs";
import router from "./auth.routes.mjs";

const route = Router();

route.post("/seats", authorize, booking.availableSeats);
route.post("/seat-booking/:id", authorize, booking.seatBooking);

export default route;
