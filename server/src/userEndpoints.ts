import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticationToken, UserRegister, UserVerify } from "./types";
import {
  createUser,
  findUserByUsername,
  verifyUserEmail,
} from "./models/userDatabase";
import { sendToEmailQueue, sendToWalletQueue } from "./utils/mq";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string; 

export async function verifyEmailEndpoint(req: Request, res: Response) {
  const { email, token } = req.query as UserVerify;
  // TODO : get token from query 
  var user = await verifyUserEmail(email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  await sendToWalletQueue(user.id!);
  return res.status(200).json({ message: "Email verified" });
}

export async function createUserEndpoint(req: Request, res: Response) {
  const body: UserRegister = req.body;
  const { email, username, password } = body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await createUser({
      email,
      username,
      password: hashedPassword,
    });

    await sendToEmailQueue(email, "1020");

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function loginEndpoint(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.emailConfirmed === false) {
      return res
        .status(400)
        .json({ message: `Please confirm your email '${user.email}'` });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const at: AuthenticationToken = {
      userId: user.id!,
      username: user.username,
    };
    const token = jwt.sign(at, jwtSecret, { expiresIn: "48h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
