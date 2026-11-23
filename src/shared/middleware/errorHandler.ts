import { ValidationError } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/index.js";

const isValidationErrorArray = (err: unknown): err is ValidationError[] => {
  return (
    Array.isArray(err) &&
    err.length > 0 &&
    err.every((item) => item instanceof ValidationError)
  );
};

const flattenValidationErrors = (
  errors: ValidationError[],
  parentPath = "",
): Record<string, string[]> => {
  const details: Record<string, string[]> = {};

  for (const error of errors) {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      details[path] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      Object.assign(details, flattenValidationErrors(error.children, path));
    }
  }

  return details;
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (isValidationErrorArray(err)) {
    res.status(400).json({
      error: "Validation failed",
      details: flattenValidationErrors(err),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
