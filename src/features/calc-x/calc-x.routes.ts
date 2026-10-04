import { Router } from "express";
import { validate } from "../../shared/middleware/validate.js";
import { CalcXController } from "./calc-x.controller.js";
import { CalcXRepository } from "./calc-x.repository.js";
import { saveCalcXResultsSchema } from "./calc-x.schemas.js";
import { CalcXService } from "./calc-x.service.js";

const repo = new CalcXRepository();
const service = new CalcXService(repo);
const controller = new CalcXController(service);

const calcXRouter = Router();

calcXRouter.post(
  "/results",
  validate(saveCalcXResultsSchema),
  controller.saveResults,
);

export { calcXRouter };
