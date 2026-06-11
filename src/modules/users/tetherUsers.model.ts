import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

// TODO: Check signin route and add google signin/up desi

export const tetherUsers = pgTable(
    "tetherUsers",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        authUserId: text("auth_user_id").notNull().unique(), // From Better-Auth
        displayName: text("display_name").notNull(),
        username: text("username").notNull().unique(),
        bio: text("bio").default("NONE"),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => ({
        authUserIdIdx: uniqueIndex("users_auth_user_id_idx").on(
            table.authUserId,
        ),
        usernameIdx: uniqueIndex("users_username_idx").on(table.username),
    }),
);
