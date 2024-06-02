import { ulid } from "ulid";
import pool from "../utils/db";
import { DatabaseUser } from "../types";

export const createUser = async (user: DatabaseUser): Promise<string> => {
  const { email, username, password } = user;
  const id = ulid();
  const result = await pool.query(
    `INSERT INTO trade.users (id, username, password, email, createdby) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id`,
    [id, username, password, email, id]
  );
  return result.rows[0];
};

export const findUserByUsername = async (
  username: string
): Promise<DatabaseUser | null> => {
  const result = await pool.query<DatabaseUser>(
    `SELECT id, username, password, email, emailConfirmed FROM trade.users WHERE username = $1`,
    [username]
  );
  return result.rows[0] || null;
}

export const findUserByEmail = async (
  email: string
): Promise<DatabaseUser | null> => {
  const result = await pool.query<DatabaseUser>(
    `SELECT id, username, password, email, emailConfirmed FROM trade.users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}
export const verifyUserEmail = async (
  email: string
): Promise<DatabaseUser | null> => {
  const result = await pool.query<DatabaseUser>(
    `UPDATE trade.users 
    SET emailConfirmed = true 
    WHERE email = $1 
    RETURNING *`,
    [email]
  );
  return result.rows[0] || null;
}

export const checkEmailVerified = async (
  email: string
): Promise<boolean> => {
  const result = await pool.query<DatabaseUser>(
    `SELECT 1 
      FROM trade.users 
      WHERE email = $1 
      AND emailConfirmed = TRUE`,
    [email]
  );

  return (result.rowCount ?? 0) > 0;
}