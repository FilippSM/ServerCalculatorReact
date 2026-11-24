import { randomUUID } from "node:crypto"
import type { DBType, OilTestType } from "../db/db.js"
import type { OilTestCreateModel } from "../models/OilTestCreateModel.js"
import type { OilTestUpdateModel } from "../models/OilTestUpdateModel.js"

/**
 * Фабрика repository: доступ к данным через общий `db`.
 * Repository factory: data access via shared `db`.
 */
export const getOilTestsRepository = (db: DBType) => ({
  /** Список по дате убыв. / List sorted by date desc. */
  findAll(): OilTestType[] {
    return [...db.oilTests].sort((a, b) => b.date.localeCompare(a.date))
  },

  /** Найти по id или null. / Find by id or null. */
  findById(id: string): OilTestType | null {
    return db.oilTests.find((oilTest) => oilTest.id === id) ?? null
  },

  /** Создать запись. / Create a record. */
  create(model: OilTestCreateModel): OilTestType {
    const oilTest: OilTestType = {
      id: randomUUID(),
      date: model.date,
      results: model.results.map((result) => ({ ...result })),
    }

    db.oilTests.push(oilTest)
    return oilTest
  },

  /**
   * Частичное обновление; null если не найдено.
   * Partial update; null if not found.
   */
  update(id: string, model: OilTestUpdateModel): OilTestType | null {
    const index = db.oilTests.findIndex((oilTest) => oilTest.id === id)
    const existing = db.oilTests[index]

    if (!existing) {
      return null
    }

    const updated: OilTestType = {
      id: existing.id,
      date: model.date ?? existing.date,
      results: model.results?.map((result) => ({ ...result })) ?? existing.results,
    }

    db.oilTests[index] = updated
    return updated
  },

  /**
   * Удалить; true/false — успех.
   * Delete; true/false = success.
   */
  delete(id: string): boolean {
    const index = db.oilTests.findIndex((oilTest) => oilTest.id === id)

    if (index === -1) {
      return false
    }

    db.oilTests.splice(index, 1)
    return true
  },
})

export type OilTestsRepository = ReturnType<typeof getOilTestsRepository>
