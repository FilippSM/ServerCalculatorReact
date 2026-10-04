import type { NextFunction, Request, Response } from "express";
import type { CalcXService } from "./calc-x.service.js";
import type { SaveCalcXResultsRequest } from "./calc-x.schemas.js";

export class CalcXController {
  constructor(private readonly calcXService: CalcXService) {}

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
}
