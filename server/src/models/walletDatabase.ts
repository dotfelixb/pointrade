import { ulid } from "ulid";
import pool from "../utils/db";
import { WalletBalance, WalletDeposit, WalletSend } from "../types";

export const isUniqueIssuedKey = async (
  issuedkey: string
): Promise<boolean> => {
  const result = await pool.query(
    `SELECT 1 FROM trade.transactions WHERE issuedkey = $1`,
    [issuedkey]
  );
  return (result.rowCount ?? 0) > 0;
};

export const createDeposit = async (
  deposit: WalletDeposit
): Promise<{ id: string } | null> => {
  const { userid, currencyid, issuedkey, rate, amount } = deposit;
  const id = ulid();
  const result = await pool.query(
    `INSERT INTO trade.transactions (id, issuerid, issueeid, issuercurrencyid, issueecurrencyid, issuedkey, rate, amount, createdby, updatedby) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id`,
    [
      id,
      "holder",
      userid,
      currencyid,
      currencyid,
      issuedkey,
      rate,
      amount,
      "system",
      "system",
    ]
  );
  return result.rows[0] || null;
};

export const createSend = async (
  deposit: WalletSend
): Promise<{ id: string } | null> => {
  const {
    issuerid,
    issueeid,
    issuercurrencyid,
    issueecurrencyid,
    issuedkey,
    rate,
    amount,
  } = deposit;
  const id = ulid();
  const result = await pool.query(
    `INSERT INTO trade.transactions (id, issuerid, issueeid, issuercurrencyid, issueecurrencyid, issuedkey, rate, amount, createdby, updatedby) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id`,
    [
      id,
      issuerid,
      issueeid,
      issuercurrencyid,
      issueecurrencyid,
      issuedkey,
      rate,
      amount,
      "system",
      "system",
    ]
  );
  return result.rows[0] || null;
};

export const checkIssuerBalance = async (
  issuerid: string,
  issuercurrencyid: string,
  amount: number
): Promise<boolean> => {
  const result = await pool.query(
    `SELECT 1
    FROM trade.wallets w
    WHERE w.userid = $1
    AND w.currencyid = $2
    AND w.balance > $3`,
    [issuerid, issuercurrencyid, amount]
  );
  return (result.rowCount ?? 0) > 0;
};

export const walletBalance = async (
  userid: string,
  currencyid: string
): Promise<WalletBalance> => {
  const result = await pool.query(
    `SELECT balance, balanceat FROM trade.wallets WHERE userid = $1 AND currencyid = $2`,
    [userid, currencyid]
  );
  return result.rows[0];
};
