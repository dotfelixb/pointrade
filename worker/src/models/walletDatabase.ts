import { ulid } from "ulid";
import pool from "../utils/db";
import { Logger } from "winston";

export const balanceWallet = async (
  userid: string,
  currencyid: string
): Promise<boolean> => {
  console.log(userid, currencyid);
  try {
    const result = await pool.query(
      `WITH credit_leg AS (
            SELECT coalesce(sum(tl.amount), 0)
            FROM trade.transactions t JOIN trade.transaction_legs tl
            ON t.id = tl.transactionid 
            WHERE tl.userid = $1
            AND tl.currencyid = $2
            AND tl.leg = 'credit'
            AND t.deleted = FALSE 
        ), debit_leg AS (
            SELECT coalesce(sum(tl.amount), 0)
            FROM trade.transactions t JOIN trade.transaction_legs tl
            ON t.id = tl.transactionid 
            WHERE tl.userid = $1
            AND tl.currencyid = $2
            AND tl.leg = 'debit'
            AND t.deleted = FALSE 
        )
        UPDATE trade.wallets 
        SET balance = ((SELECT * FROM credit_leg LIMIT 1) - (SELECT * FROM debit_leg LIMIT 1)),
            balanceat = now(),
            updatedby = $1,
            updatedat = now()
        WHERE userid = $1
        AND currencyid = $2`,
      [userid, currencyid]
    );
    return (result.rowCount ?? 0) > 0;
  } catch (err: any) {
    throw err;
  }
};
