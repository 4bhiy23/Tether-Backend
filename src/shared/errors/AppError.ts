// src/shared/errors/AppError.ts

export class AppError extends Error {
    statusCode: number;
    code: string | undefined;

    constructor(statusCode: number, message: string, code?: string) {
        super(message);

        this.statusCode = statusCode;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}
