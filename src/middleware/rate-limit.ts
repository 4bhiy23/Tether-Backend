// src/middlewares/rate-limit.ts
import type { Request, Response, NextFunction } from "express";
import type { RateLimiterRedis } from "rate-limiter-flexible";

export function rateLimit(limiter: RateLimiterRedis) {
    return async function rateLimitMiddleware(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // ensure key is always a string (req.ip can be undefined)
            const key = String(req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.connection?.remoteAddress || "unknown");

            await limiter.consume(key);

            next();
        } catch (error: any) {
            const retryAfterSeconds = Math.ceil(error.msBeforeNext / 1000) || 1;

            res.set("Retry-After", String(retryAfterSeconds));

            res.status(429).json({
                message: "Too many requests. Please try again later.",
                retryAfter: retryAfterSeconds,
            });
        }
    };
}
