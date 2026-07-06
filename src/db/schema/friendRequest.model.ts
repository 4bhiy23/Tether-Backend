import { pgTable, uuid, timestamp, index, text } from "drizzle-orm/pg-core";
import { user } from "../schema.js"
import { sql } from "drizzle-orm";
export const friendRequests = pgTable(
    "friend_requests",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        senderId: text("sender_id")
            .notNull()
            .references(() => user.id),

        receiverId: text("receiver_id")
            .notNull()
            .references(() => user.id),

        status: text("status").notNull(),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
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
