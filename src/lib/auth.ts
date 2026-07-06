import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./auth-schema.js";
import { env } from "../config/env.js";
import { generateUsername } from "../utils/generateRandomUsername.js";
import { user as userTable} from "../db/schema.js"
import { eq } from "drizzle-orm";

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
                after: async (createdUser) => {
                    await db
                        .update(userTable)
                        .set({
                            username: await generateUsername(),
                        })
                        .where(eq(userTable.id, createdUser.id));
                },
            },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            // Optional: specify which providers can auto-link
            trustedProviders: ["github", "email"],
        },
    },
    trustedOrigins: [env.FRONTEND_URL],
});
