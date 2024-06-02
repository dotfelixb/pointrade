import { ulid } from "ulid";
import pool from "../utils/db";
import { DatabaseUser, WalletDeposit, WalletSend } from "../types";

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


