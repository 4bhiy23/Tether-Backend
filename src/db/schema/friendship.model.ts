import {
    index,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { tetherUsers } from "../../modules/users/tetherUsers.model.ts";
import { sql } from "drizzle-orm";

export const friendships = pgTable(
    "friendships",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        userId: uuid("user_id")
            .notNull()
            .references(() => tetherUsers.id),

        friendId: uuid("friend_id")
            .notNull()
            .references(() => tetherUsers.id),

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
