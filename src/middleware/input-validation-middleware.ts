import { plainToInstance, type ClassConstructor } from "class-transformer"
import { validate, type ValidationError } from "class-validator"
import type { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../utils.js"

type RequestPart = "body" | "params" | "query"

type ValidationErrorView = {
  field: string
  messages: string[]
}

/**
 * Схлопывает вложенные ошибки class-validator в плоский список.
 * Flattens nested class-validator errors into a flat list.
 */
const flattenValidationErrors = (errors: ValidationError[], parentPath = ""): ValidationErrorView[] =>
  errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property
    const currentError = error.constraints ? [{ field, messages: Object.values(error.constraints) }] : []
    const childErrors = error.children?.length ? flattenValidationErrors(error.children, field) : []

    return [...currentError, ...childErrors]
  })

/**
 * Валидация body/params/query через class-validator DTO → 400 или next().
 * Validates body/params/query via class-validator DTO → 400 or next().
 */
export const inputValidationMiddleware =
  <Model extends object>(ModelClass: ClassConstructor<Model>, part: RequestPart = "body") =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const model = plainToInstance(ModelClass, req[part], {
      enableImplicitConversion: true,
    })
    const errors = await validate(model, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })

    if (errors.length > 0) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errors: flattenValidationErrors(errors),
      })
      return
    }

    req[part] = model
    next()
  }
