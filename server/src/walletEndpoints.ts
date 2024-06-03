import { Request, Response } from "express";
import dotenv from "dotenv";
import { WalletDeposit, WalletSend } from "./types";
import {
  createDeposit,
  createSend,
  isUniqueIssuedKey,
  walletBalance,
} from "./models/walletDatabase";
import { sendToProcessQueue } from "./utils/mq";

dotenv.config();

export async function walletBalanceEndpoint(req: Request, res: Response) {
  const { userid, currencyid } = req.body;
  const result = await walletBalance(userid, currencyid);
  console.log(result);

  return res.status(200).json(result);
}

export async function walletDepositEndpoint(req: Request, res: Response) {
  const body: WalletDeposit = req.body;
  const { userid, currencyid, issuedkey, amount } = body;

  if (!userid || !currencyid || !issuedkey || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const message = "Deposit successful, detail email sent";

  // check if idempotent key is unique
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

export async function walletSendEndpoint(req: Request, res: Response) {
  const body: WalletSend = req.body;
  const {
    issuerid,
    issueeid,
    issuercurrencyid,
    issueecurrencyid,
    issuedkey,
    amount,
  } = body;

  if (
    !issuerid ||
    !issueeid ||
    !issuercurrencyid ||
    !issueecurrencyid ||
    !issuedkey ||
    !amount
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const message = "Sent successful, detail email sent";

  // check if idempotent key is unique
  var isUnique = await isUniqueIssuedKey(issuedkey);
  if (isUnique) {
    return res.status(201).json({ message });
  }

  // get rate from currency service
  var result = await createSend({ ...body, rate: 1.0 });
  if (result === null) {
    return res.status(500).json({ message: "Send failed" });
  }

  await sendToProcessQueue(result.id);
  return res.status(201).json({ message });
}