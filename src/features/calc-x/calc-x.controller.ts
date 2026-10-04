import type { NextFunction, Request, Response } from "express";
import type { CalcXService } from "./calc-x.service.js";
import type {
  CalcXResultIdParams,
  SaveCalcXResultsRequest,
  UpdateCalcXResultsRequest,
} from "./calc-x.schemas.js";

export class CalcXController {
  constructor(private readonly calcXService: CalcXService) {}

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.calcXService.getAll();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  };

  saveResults = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as SaveCalcXResultsRequest;
      const data = await this.calcXService.saveResults(body);
      res.status(201).json({ data });
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
      const { id } = req.params as CalcXResultIdParams;
      const body = req.body as UpdateCalcXResultsRequest;
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
      const { id } = req.params as CalcXResultIdParams;
      await this.calcXService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
