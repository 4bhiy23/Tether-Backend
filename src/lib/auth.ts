import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./auth-schema.js";
import { env } from "../config/env.js";
import { tetherUsers } from "../db/schema.js";
import { generateUsername } from "../utils/generateRandomUsername.js";

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
                        displayName: user.name || user.email?.split("@")[0] || "User",
                        username: await generateUsername(),
                        createdAt: user.createdAt,
                        updatedAt: user.createdAt,
                    });
                },
            },
        },
    },
    trustedOrigins: [env.FRONTEND_URL],
});
