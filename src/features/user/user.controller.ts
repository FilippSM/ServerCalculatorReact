import type { NextFunction, Request, Response } from "express";
import type { UserService } from "./user.service.js";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserIdParams,
} from "./user.schemas.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.userService.getAll();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as UserIdParams;
      const user = await this.userService.getById(id);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as CreateUserInput;
      const user = await this.userService.create(body);
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as UserIdParams;
      const body = req.body as UpdateUserInput;
      const user = await this.userService.update(id, body);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as UserIdParams;
      await this.userService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
