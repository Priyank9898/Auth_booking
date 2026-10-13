import express from "express";
import authRoute from "./routes/auth.routes.mjs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);

export default app;
