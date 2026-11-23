import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";

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
] as const;

export type OilTestId = (typeof OIL_TEST_IDS)[number];

export type OilTestResult = {
  testId: OilTestId;
  value: number | null;
};

export type OilTest = {
  id: string;
  date: string;
  results: OilTestResult[];
};

export type OilTestList = OilTest[];

export type GetOilTestListResponse = { data: OilTestList };
export type GetOilTestResponse = { data: OilTest };
export type SaveOilTestResponse = { data: OilTest };
export type UpdateOilTestResponse = { data: OilTest };

export class OilTestResultDto implements OilTestResult {
  @IsIn(OIL_TEST_IDS)
  testId!: OilTestId;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsNumber()
  value!: number | null;
}

export class SaveOilTestDto {
  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OilTestResultDto)
  results!: OilTestResultDto[];
}

export class UpdateOilTestDto {
  @ValidateIf(
    (o: UpdateOilTestDto) => o.date !== undefined || o.results === undefined,
  )
  @IsString()
  @IsNotEmpty()
  date?: string;

  @ValidateIf(
    (o: UpdateOilTestDto) => o.results !== undefined || o.date === undefined,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OilTestResultDto)
  results?: OilTestResultDto[];
}

export class OilTestIdParamsDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
