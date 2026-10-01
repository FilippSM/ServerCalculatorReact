import { Router } from "express";
import { validate } from "../../shared/middleware/validate.js";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "./user.schemas.js";
import { UserService } from "./user.service.js";

const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

const userRouter = Router();

userRouter.get("/", controller.getAll);
userRouter.get("/:id", validate(userIdSchema, "params"), controller.getById);
userRouter.post("/", validate(createUserSchema), controller.create);
userRouter.patch(
  "/:id",
  validate(userIdSchema, "params"),
  validate(updateUserSchema),
  controller.update,
);
userRouter.delete(
  "/:id",
  validate(userIdSchema, "params"),
  controller.delete,
);

export { userRouter };
