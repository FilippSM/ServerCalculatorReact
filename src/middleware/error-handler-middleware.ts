import type { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../utils.js"

/**
 * Глобальный обработчик ошибок (последний middleware).
 * Global error handler (last middleware).
 */
export const errorHandlerMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(error)
  res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json({ error: "Internal server error" })
}
