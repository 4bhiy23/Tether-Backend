import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./auth-schema";
import { env } from "../config/env";
import { tetherUsers } from "../db/schema";

const db = drizzle(new Pool({ connectionString: env.DATABASE_URL }), {
    schema,
});

export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await db.insert(tetherUsers).values({
                        authUserId: user.id,
                        username: user.name,
                        createdAt: user.createdAt,
                        updatedAt: user.createdAt,
                    });
                },
            },
        },
    },
    trustedOrigins: ["http://localhost:3001"],
});
