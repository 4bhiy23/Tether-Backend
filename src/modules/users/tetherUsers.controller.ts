import type { Request, Response } from "express";
import db from "../../db/db.js";
import { friendships } from "../../db/schema.js";
import { and, eq, or } from "drizzle-orm";
import { AppError } from "../../shared/errors/AppError.js";
import { friendRequests } from "../../db/schema/friendRequest.model.js";

export const myFriends = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const friends = await db
        .select()
        .from(friendships)
        .where(eq(friendships.userId, userId))

    res.json({ friends });
};

export const addFriend = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { friendUsername } = req.params as { friendUsername: string };
    console.log("friendUsername", friendUsername);
    // Check if the friendship already exists
    // const [existingFriendship] = await db
    //     .select()
    //     .from(friendships)
    //     .where(
    //         or(
    //             and(
    //                 eq(friendships.userId, userId),
    //                 eq(friendships.friendId, friendUser?.id),
    //             ),
    //             and(
    //                 eq(friendships.userId, friendUser?.id),
    //                 eq(friendships.friendId, userId),
    //             ),
    //         ),
    //     );
    
    // if(existingFriendship){
    //     throw new AppError(111,"Already friends")
    // }

    // await db
    // .insert(friendRequests)
    // .values({
    //     senderId: userId,
    //     receiverId: friendUsername,
    //     status: "pending",
    // })
    
}