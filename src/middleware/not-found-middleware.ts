import type { Request, Response } from "express"
import { HTTP_STATUSES } from "../utils.js"

/**
 * 404 для неизвестных маршрутов.
 * 404 for unknown routes.
 */
export const notFoundMiddleware = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: "Nothing found" })
}
