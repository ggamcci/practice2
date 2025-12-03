import { Router } from "express";
import authRouter from "./auth.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API Root OK" });
});

// /api/auth/...
router.use("/auth", authRouter);

export default router;
