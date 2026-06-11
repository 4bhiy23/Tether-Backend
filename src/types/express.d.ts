import "express-serve-static-core";

declare module "express-serve-static-core" {
    interface Request {
        requestId: string;
        logger: any;
        session: any;
        user?: any;
    }
}

export {};
