import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { WalletDeposit } from "./types";
import { createDeposit, isUniqueIssuedKey } from "./models/walletDatabase";
import { sendToProcessQueue } from "./utils/mq";

dotenv.config();

export async function walletDepositEndpoint(req: Request, res: Response) {
  const body: WalletDeposit = req.body;
  const { userid, currencyid, issuedkey, amount } = body;

  if (!userid || !currencyid || !issuedkey || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const message = "Deposit successful, detail email sent";

  // check if idempotency key is unique
  var isUnique = await isUniqueIssuedKey(issuedkey);
  if (isUnique) {
    return res.status(201).json({ message });
  }

  // get rate from currency service
  var result = await createDeposit({ ...body, rate: 1.0 });
  if (result === null) {
    return res.status(500).json({ message: "Deposit failed" });
  }

  await sendToProcessQueue(result.id);
  return res.status(201).json({ message });
}
