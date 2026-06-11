import {
    boolean,
    index,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { conversations } from "./conversations.model";
import { tetherUsers } from "../../modules/users/tetherUsers.model.ts";
import { sql } from "drizzle-orm";
import { conversationMemberRole } from "./enums";

export const conversationMembers = pgTable(
    "conversation_members",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        conversationId: uuid("conversation_id")
            .notNull()
            .references(() => conversations.id),

        userId: uuid("user_id")
            .notNull()
            .references(() => tetherUsers.id),

        role: conversationMemberRole("role").notNull(),

        joinedAt: timestamp("joined_at", { withTimezone: true }).notNull(),
        leftAt: timestamp("left_at", { withTimezone: true }),

        lastReadMessageId: uuid("last_read_message_id"),
        lastReadAt: timestamp("last_read_at", { withTimezone: true }),

        isMuted: boolean("is_muted").notNull(),
        isArchived: boolean("is_archived").notNull(),

        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    },
    (table) => ({
        uniqueMember: uniqueIndex("cm_unique_idx").on(
            table.conversationId,
            table.userId,
        ),
        userUpdatedIdx: index("cm_user_updated_idx").on(
            table.userId,
            table.updatedAt,
        ),
        conversationIdx: index("cm_conversation_idx").on(table.conversationId),
    }),
);
