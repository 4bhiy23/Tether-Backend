import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = express.Router();

// Example protected route to get user profile
router.get("/me", requireAuth, async (req, res) => {
    const session = req.session.user;
    const user = req.user;
    res.json({ session, user });
});

export default router;