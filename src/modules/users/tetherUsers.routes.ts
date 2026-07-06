import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { addFriend, myFriends } from "./tetherUsers.controller.js";

const router = express.Router();

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
 *         description: UUID of the user to send the friend request to.
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


export default router;
