/**
 * Допустимые id тестов масла.
 * Allowed oil test ids.
 */
export const OIL_TEST_IDS = [
  "flashPoint",
  "mechanicalImpurities",
  "densityAt20",
  "kinematicViscosity100",
  "kinematicViscosity40",
  "viscosityIndex",
  "waterContent",
  "pourPoint",
  "freezingPoint",
  "noackLoss",
  "dynamicViscosity30",
  "colorCnt",
  "baseNumber",
  "autoIgnition",
] as const

export type OilTestId = (typeof OIL_TEST_IDS)[number]

/** Один результат теста. / Single test result. */
export type OilTestResultType = {
  testId: OilTestId
  value: number | null
}

/** Доменная сущность в БД. / Domain entity in DB. */
export type OilTestType = {
  id: string
  date: string
  results: OilTestResultType[]
}

/** Форма in-memory БД. / In-memory DB shape. */
export type DBType = {
  oilTests: OilTestType[]
}

/**
 * Единое хранилище данных (временно в памяти).
 * Shared data store (temporary in-memory).
 */
export const db: DBType = {
  oilTests: [],
}
