import { pgEnum } from "drizzle-orm/pg-core";

export const friendRequestStatus = pgEnum("friend_request_status", [
    "pending",
    "accepted",
    "rejected",
    "cancelled",
]);

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
