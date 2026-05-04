import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { attachDatabasePool } from "@vercel/functions";

// Set up database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Attach pool for serverless environments (Fluid Compute)
if (process.env.VERCEL) {
  attachDatabasePool(pool);
}

export const db = drizzle(pool);

// Export pool for potential direct use
export { pool };
