import type { NextFunction, Request, Response } from "express";
import type { CalcXService } from "./calc-x.service.js";
import type {
  GetOilTestListResponse,
  GetOilTestResponse,
  OilTestIdParamsDto,
  SaveOilTestDto,
  SaveOilTestResponse,
  UpdateOilTestDto,
  UpdateOilTestResponse,
} from "./calc-x.dto.js";

export class CalcXController {
  constructor(private readonly calcXService: CalcXService) {}

  getAll = async (
    _req: Request,
    res: Response<GetOilTestListResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.calcXService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response<GetOilTestResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as unknown as OilTestIdParamsDto;
      const data = await this.calcXService.getById(id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  };

  save = async (
    req: Request,
    res: Response<SaveOilTestResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as SaveOilTestDto;
      const data = await this.calcXService.save(body);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response<UpdateOilTestResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as unknown as OilTestIdParamsDto;
      const body = req.body as UpdateOilTestDto;
      const data = await this.calcXService.update(id, body);
      res.json({ data });
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
      const { id } = req.params as unknown as OilTestIdParamsDto;
      await this.calcXService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
