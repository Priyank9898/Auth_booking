import { Router } from "express";
import * as authService from "../services/auth.service.mjs";
import { validate } from "../middleware/auth.middleware.mjs";
import { loginSchema, registerSchema } from "../schemas/auth.schema.mjs";

const router = Router();

router.post("/sign-up", validate(registerSchema), authService.register);
router.post("/login", validate(loginSchema), authService.login);

export default router;
