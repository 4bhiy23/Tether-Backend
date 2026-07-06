import {
    index,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    text,
} from "drizzle-orm/pg-core";
import { user } from "../schema.js"
import { sql } from "drizzle-orm";

export const friendships = pgTable(
    "friendships",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        userId: text("user_id")
            .notNull()
            .references(() => user.id),

        friendId: text("friend_id")
            .notNull()
            .references(() => user.id),

        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    },
    (table) => ({
        uniqueFriendship: uniqueIndex("friendship_unique_idx").on(
            table.userId,
            table.friendId,
        ),
        userIdx: index("friendships_user_idx").on(table.userId),
        friendIdx: index("friendships_friend_idx").on(table.friendId),
    }),
);
