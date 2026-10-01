import express from "express";
import { userRouter } from "./features/user/index.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { notFound } from "./shared/middleware/notFound.js";

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use(notFound);
app.use(errorHandler);

export { app };
