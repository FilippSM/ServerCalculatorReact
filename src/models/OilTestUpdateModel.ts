import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateIf, ValidateNested } from "class-validator"
import { OilTestResultModel } from "./OilTestCreateModel.js"

/**
 * DTO для PATCH: нужно хотя бы одно поле (date или results).
 * PATCH DTO: at least one field required (date or results).
 */
export class OilTestUpdateModel {
  @ValidateIf((model: OilTestUpdateModel) => model.date !== undefined || model.results === undefined)
  @IsString()
  @IsNotEmpty()
  date?: string

  @ValidateIf((model: OilTestUpdateModel) => model.results !== undefined || model.date === undefined)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OilTestResultModel)
  results?: OilTestResultModel[]
}
