import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { conversations } from "../schema/conversations.model.ts";
import { tetherUsers } from "../../modules/users/tetherUsers.model.ts";
import { messageType } from "./enums";
import { sql } from "drizzle-orm";

export const messages = pgTable(
    "messages",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        conversationId: uuid("conversation_id")
            .notNull()
            .references(() => conversations.id),

        senderId: uuid("sender_id")
            .notNull()
            .references(() => tetherUsers.id),

        type: messageType("type").notNull(),

        text: text("text").notNull(),

        editedAt: timestamp("edited_at", { withTimezone: true }),
        deletedAt: timestamp("deleted_at", { withTimezone: true }),

        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    },
    (table) => ({
        convCreatedIdx: index("msg_conv_created_idx").on(
            table.conversationId,
            table.createdAt,
        ),
        senderIdx: index("msg_sender_idx").on(table.senderId),
    }),
);
