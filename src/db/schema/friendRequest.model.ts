import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { friendRequestStatus } from "./enums";
import { tetherUsers } from "../../modules/users/tetherUsers.model.ts";
import { sql } from "drizzle-orm";
export const friendRequests = pgTable(
    "friend_requests",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        senderId: uuid("sender_id")
            .notNull()
            .references(() => tetherUsers.id),

        receiverId: uuid("receiver_id")
            .notNull()
            .references(() => tetherUsers.id),

        status: friendRequestStatus("status").notNull(),

        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    },
    (table) => ({
        receiverStatusIdx: index("fr_receiver_status_idx").on(
            table.receiverId,
            table.status,
        ),
        senderStatusIdx: index("fr_sender_status_idx").on(
            table.senderId,
            table.status,
        ),
        senderReceiverIdx: index("fr_sender_receiver_idx").on(
            table.senderId,
            table.receiverId,
        ),
    }),
);
