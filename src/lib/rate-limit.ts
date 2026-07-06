// src/lib/rate-limit.ts
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./redis.js";

export const generalApiLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "rl:api",
    points: 100,
    duration: 60,
});