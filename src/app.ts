import express from "express";
import { calcXRouter } from "./features/calc-x/index.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { notFound } from "./shared/middleware/notFound.js";

const app = express();

app.use(express.json());
app.use("/calc-x", calcXRouter);
app.use(notFound);
app.use(errorHandler);

export { app };
