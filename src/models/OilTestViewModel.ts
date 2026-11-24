import type { OilTestType } from "../db/db.js"

/**
 * Ответ API клиенту (без внутренних полей БД).
 * API response for the client (no internal DB fields).
 */
export type OilTestViewModel = {
  id: string
  date: string
  results: OilTestType["results"]
}

/**
 * Маппер entity → ViewModel.
 * Maps entity → ViewModel.
 */
export const getOilTestViewModel = (oilTest: OilTestType): OilTestViewModel => ({
  id: oilTest.id,
  date: oilTest.date,
  results: oilTest.results.map((result) => ({ ...result })),
})
