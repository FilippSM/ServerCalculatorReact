import { Router, type Response } from "express"
import type { DBType } from "../db/db.js"
import { inputValidationMiddleware } from "../middleware/input-validation-middleware.js"
import { OilTestCreateModel } from "../models/OilTestCreateModel.js"
import { OilTestUpdateModel } from "../models/OilTestUpdateModel.js"
import { getOilTestViewModel, type OilTestViewModel } from "../models/OilTestViewModel.js"
import { URIParamsOilTestModel } from "../models/URIParamsOilTestModel.js"
import { getOilTestsRepository } from "../repositories/oil-tests-repository.js"
import type { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types.js"
import { HTTP_STATUSES } from "../utils.js"

type OilTestResponse = { data: OilTestViewModel }
type OilTestListResponse = { data: OilTestViewModel[] }

/**
 * Фабрика роутера calc-x: validators → handler → repository → ViewModel.
 * calc-x router factory: validators → handler → repository → ViewModel.
 */
export const getCalcXRouter = (db: DBType): Router => {
  const router = Router()
  const oilTestsRepository = getOilTestsRepository(db)

  /** GET /results — список. / list. */
  router.get("/results", (_req: RequestWithParams<Record<string, never>>, res: Response<OilTestListResponse>): void => {
    const data = oilTestsRepository.findAll().map(getOilTestViewModel)
    res.status(HTTP_STATUSES.OK_200).json({ data })
  })

  /** GET /results/:id — одна запись. / one record. */
  router.get<URIParamsOilTestModel, OilTestResponse | { error: string }>(
    "/results/:id",
    inputValidationMiddleware(URIParamsOilTestModel, "params"),
    (req: RequestWithParams<URIParamsOilTestModel>, res: Response<OilTestResponse | { error: string }>): void => {
      const oilTest = oilTestsRepository.findById(req.params.id)

      if (!oilTest) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: "Oil test not found" })
        return
      }

      res.status(HTTP_STATUSES.OK_200).json({ data: getOilTestViewModel(oilTest) })
    },
  )

  /** POST /results — создать. / create. */
  router.post(
    "/results",
    inputValidationMiddleware(OilTestCreateModel),
    (req: RequestWithBody<OilTestCreateModel>, res: Response<OilTestResponse>): void => {
      const oilTest = oilTestsRepository.create(req.body)
      res.status(HTTP_STATUSES.CREATED_201).json({ data: getOilTestViewModel(oilTest) })
    },
  )

  /** PATCH /results/:id — частичное обновление. / partial update. */
  router.patch<URIParamsOilTestModel, OilTestResponse | { error: string }, OilTestUpdateModel>(
    "/results/:id",
    inputValidationMiddleware(URIParamsOilTestModel, "params"),
    inputValidationMiddleware(OilTestUpdateModel),
    (
      req: RequestWithParamsAndBody<URIParamsOilTestModel, OilTestUpdateModel, OilTestResponse | { error: string }>,
      res: Response<OilTestResponse | { error: string }>,
    ): void => {
      const oilTest = oilTestsRepository.update(req.params.id, req.body)

      if (!oilTest) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: "Oil test not found" })
        return
      }

      res.status(HTTP_STATUSES.OK_200).json({ data: getOilTestViewModel(oilTest) })
    },
  )

  /** DELETE /results/:id — удалить. / delete. */
  router.delete<URIParamsOilTestModel, { error: string }>(
    "/results/:id",
    inputValidationMiddleware(URIParamsOilTestModel, "params"),
    (req: RequestWithParams<URIParamsOilTestModel>, res: Response<{ error: string }>): void => {
      if (!oilTestsRepository.delete(req.params.id)) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: "Oil test not found" })
        return
      }

      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    },
  )

  return router
}
