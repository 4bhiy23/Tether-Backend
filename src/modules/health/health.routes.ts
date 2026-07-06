import { Router } from "express";
import db from "../../db/db.js";
import { AppError } from "../../shared/errors/AppError.js";

const router = Router();
/**
 * @openapi
 * /v1/api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get("/", (req, res) => {
    res.status(200).json({ service: "Tether", status: "ok" });
});

/**
 * @openapi
 * /v1/api/health/db:
 *   get:
 *     tags:
 *       - Health
 *     summary: Database health check
 *     responses:
 *       200:
 *         description: Database is healthy
 */
router.get("/db", async (req, res, next) => {
    try {
        req.logger.info("Starting database health check");
        const start = Date.now();
        await db.execute("SELECT 1");
        const latency = Date.now() - start;
        req.logger.info("Database health check successful", {
            latencyMs: latency,
        });
        return res.json({
            success: true,
            status: "ok",
            database: "connected",
            latencyMs: latency,
        });
    } catch (err) {
        req.logger.error("Database health check failed", { error: err });
        return next(
            new AppError(
                503,
                "Database health check failed",
                "DATABASE_UNAVAILABLE",
            ),
        );
    }
});
export default router;
