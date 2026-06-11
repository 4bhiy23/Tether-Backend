import { pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { tetherUsers } from "../../modules/users/tetherUsers.model.ts";
import { sql } from "drizzle-orm";

export const blocks = pgTable(
    "blocks",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        blockerId: uuid("blocker_id")
            .notNull()
            .references(() => tetherUsers.id),

        blockedId: uuid("blocked_id")
            .notNull()
            .references(() => tetherUsers.id),

        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    },
    (table) => ({
        uniqueBlock: uniqueIndex("blocks_unique_idx").on(
            table.blockerId,
            table.blockedId,
        ),
    }),
);
