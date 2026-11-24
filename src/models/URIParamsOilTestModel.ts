import { IsUUID } from "class-validator"

/**
 * DTO params `:id` (UUID). Index signature нужен для Express ParamsDictionary.
 * `:id` params DTO (UUID). Index signature is required for Express ParamsDictionary.
 */
export class URIParamsOilTestModel {
  [key: string]: string

  @IsUUID()
  id!: string
}
