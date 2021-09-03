import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["token"]) {
    const token = req.headers["token"];
    const decoded = await jwt.verify(
      token as string,
      process.env.JWT_PRIVATE_KEY || ""
    );
    if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
      const userId = decoded["id"];
      const {
        params: { id },
      } = req;
      if (id === userId) {
        return next();
      }
    }
  }
  return res.json({
    ok: false,
    error: "You don't have access",
  });
};
