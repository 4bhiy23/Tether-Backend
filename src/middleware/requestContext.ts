import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { logger } from "./../config/logger.ts";

export function requestContext(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const requestId = (req.header("x-request-id") as string) || randomUUID();

    req.requestId = requestId;

    // 🔥 KEY IDEA: create request-scoped logger
    req.logger = logger.child({
        requestId,
        route: req.originalUrl,
        method: req.method,
    });

    res.setHeader("x-request-id", requestId);

    req.logger.info("Incoming request");

    next();
}
