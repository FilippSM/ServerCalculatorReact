import { plainToInstance, type ClassConstructor } from "class-transformer";
import { validate as validateDto } from "class-validator";
import type { NextFunction, Request, Response } from "express";

type RequestPart = "body" | "params" | "query";

export const validate = <T extends object>(
  DtoClass: ClassConstructor<T>,
  part: RequestPart = "body",
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instance = plainToInstance(DtoClass, req[part], {
        enableImplicitConversion: true,
      });

      const errors = await validateDto(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        next(errors);
        return;
      }

      req[part] = instance;
      next();
    } catch (error) {
      next(error);
    }
  };
};
