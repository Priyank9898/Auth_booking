import { Router } from "express";
import authorize from "../middleware/authorize.middleware.mjs";
import * as booking from "../services/seats.service.mjs";

const route = Router();

route.post("/seats", authorize, booking.availableSeats);

export default route;
