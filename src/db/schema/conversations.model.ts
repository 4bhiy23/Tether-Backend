import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { conversationType, conversationVisibility } from "./enums.js";
import {user} from "../schema.js"
import { sql } from "drizzle-orm";

export const conversations = pgTable(
    "conversations",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        type: conversationType("type").notNull(),
        visibility: conversationVisibility("visibility").notNull(),

        name: text("name"),
        description: text("description"),
        avatarUrl: text("avatar_url"),

        createdBy: text("created_by").references(() => user.id),

        lastMessageId: uuid("last_message_id"),
        lastMessageAt: timestamp("last_message_at", { withTimezone: true }),

        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    },
    (table) => ({
        visibilityTypeUpdatedIdx: index("conv_visibility_type_updated_idx").on(
            table.visibility,
            table.type,
            table.updatedAt,
        ),
        lastMessageAtIdx: index("conv_last_message_at_idx").on(
            table.lastMessageAt,
        ),
    }),
);
