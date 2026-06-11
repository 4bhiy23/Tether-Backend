import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { logger } from "../config/logger";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
export default db;