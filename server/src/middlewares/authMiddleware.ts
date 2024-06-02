import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticationToken } from "../types";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
  user?: AuthenticationToken;
}

export const useAuthenticationToken = (
  req: AuthRequest,
  res: Response,
  next: () => void
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthenticationToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
