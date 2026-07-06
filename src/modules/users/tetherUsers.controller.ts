import type { Request, Response } from "express";
import db from "../../db/db.js";
import { friendships, user } from "../../db/schema.js";
import { and, eq, or } from "drizzle-orm";
import { AppError } from "../../shared/errors/AppError.js";
import { friendRequests } from "../../db/schema/friendRequest.model.js";

export const myFriends = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const friends = await db
        .select({
            username: user.username,
        })
        .from(friendships)
        .innerJoin(user, eq(friendships.friendId, user.id))
        .where(
            or(
                eq(friendships.userId, userId),
                eq(friendships.friendId, userId),
            ),
        );
    res.json({
        friends: friends.map((f) => f.username),
    });
};

export const addFriend = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { friendUsername } = req.params as { friendUsername: string };
    console.log("friendUsername", friendUsername);

    // Check if the friendusername is same as the user's username
    if (friendUsername === req.user.username)
        throw new AppError(400, "You cannot send a friend request to yourself");

    // check if the friend exists
    const [friend] = await db
        .select()
        .from(user)
        .where(eq(user.username, friendUsername));
    if (!friend) throw new AppError(404, "User not found");

    // check if they are already friends
    const [alreadyFriends] = await db
        .select()
        .from(friendships)
        .where(
            or(
                and(
                    eq(friendships.userId, userId),
                    eq(friendships.friendId, friend.id),
                ),
                and(
                    eq(friendships.userId, friend.id),
                    eq(friendships.friendId, userId),
                ),
            ),
        );

    if (alreadyFriends) {
        throw new AppError(409, "Users are already friends");
    }

    await db.insert(friendRequests).values({
        senderId: userId,
        receiverId: friend.id,
        status: "pending",
    });

    return res.json({ message: "Friend request sent successfully" });
};

export const incomingFriendRequests = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const requests = await db
        .select({
            id: friendRequests.id,
            senderUsername: user.username,
            status: friendRequests.status,
            createdAt: friendRequests.createdAt,
        })
        .from(friendRequests)
        .innerJoin(user, eq(friendRequests.senderId, user.id))
        .where(eq(friendRequests.receiverId, userId));

    return res.json({ requests });
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { friendUsername } = req.params as { friendUsername: string };

    const [friend] = await db
        .select()
        .from(user)
        .where(eq(user.username, friendUsername));

    if (!friend) throw new AppError(404, "User not found");

    // check if the friend request exists
    const [friendRequest] = await db
        .select()
        .from(friendRequests)
        .where(
            and(
                eq(friendRequests.senderId, friend.id),
                eq(friendRequests.receiverId, userId),
                eq(friendRequests.status, "pending"),
            ),
        );

    if (!friendRequest) throw new AppError(404, "Friend request not found");

    // create friendship
    await db.insert(friendships).values({
        userId: userId,
        friendId: friend.id,
        createdAt: new Date(),
    });

    // delete the friend request
    await db
        .delete(friendRequests)
        .where(eq(friendRequests.id, friendRequest.id));

    return res.json({ message: "Friend request accepted" });
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { friendUsername } = req.params as { friendUsername: string };

    const [friend] = await db
        .select()
        .from(user)
        .where(eq(user.username, friendUsername));

    if (!friend) throw new AppError(404, "User not found");

    await db
        .delete(friendRequests)
        .where(
            and(
                eq(friendRequests.senderId, friend.id),
                eq(friendRequests.receiverId, userId),
            ),
        );

    return res.json({ message: "Friend request rejected" });
};
