import { Router } from "express";
import * as authService from "../services/auth.service.mjs";
import { validate } from "../middleware/auth.middleware.mjs";
import { registerSchema } from "../schemas/auth.schema.mjs";

const router = Router();

router.post("/sign-up", validate(registerSchema), authService.register);

export default router;
