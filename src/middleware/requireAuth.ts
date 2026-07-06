import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { AppError } from "../shared/errors/AppError.js";
import { eq } from "drizzle-orm";
import { user } from "../db/schema.js";
import db from "../db/db.js";

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const session = await auth.api.getSession({
        headers: req.headers as unknown as HeadersInit,
    });

    if (!session) {
        throw new AppError(401, "Unauthorized");
    }
    
    (req as Request & { session: typeof session }).session = session;

    const [reqUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id));
    (req as Request & { user: typeof user }).user = reqUser;
    
    next();
}