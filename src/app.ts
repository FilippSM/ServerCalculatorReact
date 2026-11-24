import "reflect-metadata"
import express, { type Express } from "express"
import { db } from "./db/db.js"
import { errorHandlerMiddleware } from "./middleware/error-handler-middleware.js"
import { notFoundMiddleware } from "./middleware/not-found-middleware.js"
import { getCalcXRouter } from "./routes/calc-x.js"

/**
 * Сборка Express-приложения без listen (для тестов и Vercel).
 * Express app wiring without listen (for tests and Vercel).
 */
export const app: Express = express()

app.use(express.json())
app.use("/calc-x", getCalcXRouter(db))
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
