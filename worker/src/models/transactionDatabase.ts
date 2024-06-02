import pool from "../utils/db";
import { WalletTransaction } from "../types";

export const getTransactionById = async (
  id: string
): Promise<WalletTransaction | null> => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        issuerid, 
        issueeid, 
        issuercurrencyid, 
        issueecurrencyid, 
        issuedkey, 
        amount, 
        processed, 
        deleted, 
        createdby, 
        createdat, 
        updatedby, 
        updatedat 
      FROM trade.transactions 
      WHERE id = $1
      AND deleted = false`,
      [id]
    );
    return result.rows[0];
  } catch (err: any) {
    throw err;
  }
};

export const createTransactionLegs = async (
  transactionId: string
): Promise<boolean> => {
  try {
    const result = await pool.query(
      `WITH credit_leg AS (
            INSERT INTO trade.transaction_legs (transactionid, userid, currencyid, amount, leg, createdby, updatedby)
            SELECT t.id, t.issueeid, t.issueecurrencyid, (t.amount * t.rate), 'credit', t.createdby, t.updatedby 
            FROM trade.transactions t 
            WHERE t.id = $1
        ), debit_leg AS (
            INSERT INTO trade.transaction_legs (transactionid, userid, currencyid, amount, leg, createdby, updatedby)
            SELECT t.id, t.issuerid, t.issuercurrencyid, (t.amount / t.rate), 'debit', t.createdby, t.updatedby 
            FROM trade.transactions t 
            WHERE t.id = $1
        )
        UPDATE trade.transactions 
        SET processed = TRUE,
            updatedby = 'system',
            updatedat = now()
        WHERE id = $1`,
      [transactionId]
    );
    return (result.rowCount ?? 0) > 0;
  } catch (err: any) {
    throw err;
  }
};
