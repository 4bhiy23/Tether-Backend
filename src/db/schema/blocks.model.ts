import { pgTable, timestamp, uniqueIndex, uuid, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "../schema.js";

export const blocks = pgTable(
    "blocks",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        blockerId: text("blocker_id")
            .notNull()
            .references(() => user.id),

        blockedId: text("blocked_id")
            .notNull()
            .references(() => user.id),

        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    },
    (table) => ({
        uniqueBlock: uniqueIndex("blocks_unique_idx").on(
            table.blockerId,
            table.blockedId,
        ),
    }),
);
