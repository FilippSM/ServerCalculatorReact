import { Router } from "express";
import { validate } from "../../shared/middleware/validate.js";
import { CalcXController } from "./calc-x.controller.js";
import {
  OilTestIdParamsDto,
  SaveOilTestDto,
  UpdateOilTestDto,
} from "./calc-x.dto.js";
import { CalcXRepository } from "./calc-x.repository.js";
import { CalcXService } from "./calc-x.service.js";

const repo = new CalcXRepository();
const service = new CalcXService(repo);
const controller = new CalcXController(service);

const calcXRouter: Router = Router();

calcXRouter.get("/results", controller.getAll);
calcXRouter.get(
  "/results/:id",
  validate(OilTestIdParamsDto, "params"),
  controller.getById,
);
calcXRouter.post("/results", validate(SaveOilTestDto), controller.save);
calcXRouter.patch(
  "/results/:id",
  validate(OilTestIdParamsDto, "params"),
  validate(UpdateOilTestDto),
  controller.update,
);
calcXRouter.delete(
  "/results/:id",
  validate(OilTestIdParamsDto, "params"),
  controller.delete,
);

export { calcXRouter };
