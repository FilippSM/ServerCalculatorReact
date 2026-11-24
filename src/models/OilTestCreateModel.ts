import { Type } from "class-transformer"
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { OIL_TEST_IDS, type OilTestId } from "../db/db.js"

/**
 * DTO одного результата в теле запроса.
 * Single result DTO in request body.
 */
export class OilTestResultModel {
  @IsIn(OIL_TEST_IDS)
  testId!: OilTestId

  /** null допустим; число — только если не null. / null allowed; number only when not null. */
  @ValidateIf((_, value: unknown) => value !== null)
  @IsNumber()
  value!: number | null
}

/**
 * DTO для POST /calc-x/results.
 * DTO for POST /calc-x/results.
 */
export class OilTestCreateModel {
  @IsString()
  @IsNotEmpty()
  date!: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OilTestResultModel)
  results!: OilTestResultModel[]
}
