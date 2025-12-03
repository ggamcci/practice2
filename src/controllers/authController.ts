import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const result = await authService.signup({ username, email, password });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response) {
    // 5-7에서 authMiddleware에서 user를 붙여 줄 거야
    const user = (req as any).user;
    res.json({ success: true, data: user });
  },
};
