import { Request, Response } from "express";
import { WalletSend } from "../types";
import { checkIssuerBalance } from "../models/walletDatabase";

export const useCanSend = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const body: WalletSend = req.body;
  const { issuerid, issuercurrencyid, amount } = body;

  const result = await checkIssuerBalance(issuerid, issuercurrencyid, amount);
  if (!result) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  next();
};
