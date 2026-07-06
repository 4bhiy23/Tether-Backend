import { pgEnum } from "drizzle-orm/pg-core";

export const conversationType = pgEnum("conversation_type", [
    "private",
    "group",
]);

export const conversationVisibility = pgEnum("conversation_visibility", [
    "private",
    "public",
]);

export const conversationMemberRole = pgEnum("conversation_member_role", [
    "owner",
    "admin",
    "member",
]);

export const messageType = pgEnum("message_type", ["text"]);
