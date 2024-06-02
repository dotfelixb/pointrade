import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
// postgres connection
const connection = process.env.DATABASE_URL || console.error('DATABASE_URL not found');
const pool : Pool = new Pool({
  connectionString: connection!,
});

export default pool;
