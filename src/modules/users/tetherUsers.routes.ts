import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { acceptFriendRequest, addFriend, incomingFriendRequests, myFriends, rejectFriendRequest } from "./tetherUsers.controller.js";
import { user } from "../../db/schema.js"
import db from "../../db/db.js"

const router = express.Router();

/**
 * @openapi
 * /v1/api/users/all:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Returns a list of all registered users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "bMXyoKBDR7wlhStJDcdPZY4j7CYyquse"
 *                   name:
 *                     type: string
 *                     example: "test1"
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                   username:
 *                     type: string
 *                     example: "silent_panther_42"
 *                   bio:
 *                     type: string
 *                     example: "NONE"
 *                   emailVerified:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/all", async (req, res) => {
    const users = await db.select().from(user);
    return res.json(users);
});

/**
 * @openapi
 * /v1/api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *       401:
 *         description: Unauthorized.
 */
router.get("/me", requireAuth, async (req, res) => {
    const session = req.session.user;
    const user = req.user;
    res.json({ session, user });
});

/**
 * @openapi
 * /api/auth/sign-up/email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input.
 *       409:
 *         description: Email already exists.
 */

/**
 * @openapi
 * /api/auth/sign-in/email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login using email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /api/auth/sign-out:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       401:
 *         description: Unauthorized.
 */


/**
 * @openapi
 * /v1/api/users/friends:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Get the authenticated user's friends
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved friends list.
 *       401:
 *         description: Unauthorized.
 */
router.get("/friends", requireAuth, myFriends);

 /**
  * @openapi
  * /v1/api/users/friends/requests:
  *   get:
  *     tags:
  *       - Friends
  *     summary: Get incoming friend requests
  *     description: Returns all pending friend requests received by the authenticated user.
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Successfully fetched friend requests.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 requests:
  *                   type: array
  *                   items:
  *                     type: object
  *                     properties:
  *                       id:
  *                         type: string
  *                         example: "uuid-123"
  *                       senderId:
  *                         type: string
  *                         example: "user_abc"
  *                       receiverId:
  *                         type: string
  *                         example: "user_xyz"
  *                       status:
  *                         type: string
  *                         example: "pending"
  *                       createdAt:
  *                         type: string
  *                         format: date-time
  *                       updatedAt:
  *                         type: string
  *                         format: date-time
  *       401:
  *         description: Unauthorized
  *       500:
  *         description: Server error
  */
router.get("/friends/requests", requireAuth, incomingFriendRequests);

/**
 * @openapi
 * /v1/api/users/friends/{friendId}:
 *   post:
 *     tags:
 *       - Friends
 *     summary: Send a friend request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         description: Username of the user to send the friend request to.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Friend request sent successfully.
 *       400:
 *         description: Invalid request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       409:
 *         description: Users are already friends or a request already exists.
 */
router.post("/friends/:friendUsername", requireAuth, addFriend);

 /**
  * @openapi
  * /v1/api/users/friends/{friendUsername}/accept:
  *   post:
  *     tags:
  *       - Friends
  *     summary: Accept a friend request
  *     description: Accepts an incoming friend request from a user identified by username and creates a friendship.
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: friendUsername
  *         required: true
  *         schema:
  *           type: string
  *         description: Username of the user who sent the friend request
  *     responses:
  *       200:
  *         description: Friend request accepted successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Friend request accepted
  *       401:
  *         description: Unauthorized
  *       404:
  *         description: User or friend request not found
  *       500:
  *         description: Server error
  */
router.post("/friends/:friendUsername/accept", requireAuth, acceptFriendRequest);


 /**
  * @openapi
  * /v1/api/users/friends/{friendUsername}/reject:
  *   post:
  *     tags:
  *       - Friends
  *     summary: Reject a friend request
  *     description: Rejects and deletes a pending friend request from a specific user.
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: friendUsername
  *         required: true
  *         schema:
  *           type: string
  *         description: Username of the user whose friend request is being rejected
  *     responses:
  *       200:
  *         description: Friend request rejected successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Friend request rejected
  *       401:
  *         description: Unauthorized
  *       404:
  *         description: User not found
  *       500:
  *         description: Server error
  */
router.post("/friends/:friendUsername/reject", requireAuth, rejectFriendRequest);

export default router;