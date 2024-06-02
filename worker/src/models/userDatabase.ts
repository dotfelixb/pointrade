import pool from "../utils/db";

export const createWallet = async (userId: string): Promise<number> => {
  // by default users have 4 wallets
  try {
    const wallets = await pool.query(
      `SELECT id, code FROM trade.currency LIMIT 4`
    );
    const walletRows = wallets.rows;

    const result = await pool.query(
      `INSERT INTO trade.wallets (userid, currencyid, createdby, updatedby, updatedat)
      VALUES ($1, $2, $6, $1, now()), 
            ($1, $3, $6, $1, now()), 
            ($1, $4, $6, $1, now()), 
            ($1, $5, $6, $1, now()) `,
      [
        userId,
        walletRows[0].id,
        walletRows[1].id,
        walletRows[2].id,
        walletRows[3].id,
        "system",
      ]
    );

    return result.rowCount ?? 0;
  } catch (err: any) {
    if (err.message.includes("wallets_user_currency")) {
      return 1;
    }

    return 0;
  }
};
