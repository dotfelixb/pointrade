import { ulid } from "ulid";
import pool from "../utils/db";
import { Logger } from "winston";

export const createWallet = async (userId: string): Promise<number> => {
  // by default users have 4 wallets
  const wallets = await pool.query(
    `SELECT id, code FROM trade.currency LIMIT 4`
  );
  const walletRows = wallets.rows;

  const result = await pool.query(
    `INSERT INTO trade.wallets (id, userid, currencyid, createdby, updatedby)
    VALUES ($1, $5, $6, $10, $5), 
    ($2, $5, $7, $10, $5), 
    ($3, $5, $8, $10, $5), 
    ($4, $5, $9, $10, $5) `,
    [
      ulid(),
      ulid(),
      ulid(),
      ulid(),
      userId,
      walletRows[0].id,
      walletRows[1].id,
      walletRows[2].id,
      walletRows[3].id,
      "system",
    ]
  );
  return result.rowCount ?? 0;
};
