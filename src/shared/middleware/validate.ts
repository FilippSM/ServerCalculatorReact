import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type RequestPart = "body" | "params" | "query";

export const validate = (
  schema: ZodSchema,
  part: RequestPart = "body",
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[part]);
      req[part] = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
};
