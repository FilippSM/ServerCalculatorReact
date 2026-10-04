import { Router } from "express";
import { validate } from "../../shared/middleware/validate.js";
import { CalcXController } from "./calc-x.controller.js";
import { CalcXRepository } from "./calc-x.repository.js";
import {
  calcXResultIdSchema,
  saveCalcXResultsSchema,
  updateCalcXResultsSchema,
} from "./calc-x.schemas.js";
import { CalcXService } from "./calc-x.service.js";

const repo = new CalcXRepository();
const service = new CalcXService(repo);
const controller = new CalcXController(service);

const calcXRouter = Router();

calcXRouter.get("/results", controller.getAll);
calcXRouter.post(
  "/results",
  validate(saveCalcXResultsSchema),
  controller.saveResults,
);
calcXRouter.patch(
  "/results/:id",
  validate(calcXResultIdSchema, "params"),
  validate(updateCalcXResultsSchema),
  controller.update,
);
calcXRouter.delete(
  "/results/:id",
  validate(calcXResultIdSchema, "params"),
  controller.delete,
);

export { calcXRouter };
