import { NextFunction, Request, Response } from "express";

export function validateURLParams(f: string | string[]) {
    const fields: string[] = typeof(f) === "string" ? [f] : f;
    return (req: Request, res: Response, next: NextFunction) => {
        const hasAllKeys = fields.every((item) => req.params.hasOwnProperty(item));
        if (hasAllKeys) {
            next();
        } else {
            return res.status(404).json({
                error: "invalid payload"
            }).end();
        }
    };
}
