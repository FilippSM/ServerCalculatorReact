import { z } from "zod";

export const fluidTypeSchema = z.enum([
  "oil",
  "antifreeze",
  "lubricant",
  "brake_fluid",
]);

export const calcXResultItemSchema = z.object({
  name: z.string().min(1),
  result: z.string().min(1),
  uncertainty: z.string().min(1),
});

export const saveCalcXResultsSchema = z.object({
  fluidType: fluidTypeSchema,
  objectName: z.string().min(1),
  results: z.array(calcXResultItemSchema).min(1),
});

export const updateCalcXResultsSchema = z
  .object({
    fluidType: fluidTypeSchema.optional(),
    objectName: z.string().min(1).optional(),
    results: z.array(calcXResultItemSchema).min(1).optional(),
  })
  .refine(
    (data) =>
      data.fluidType !== undefined ||
      data.objectName !== undefined ||
      data.results !== undefined,
    { message: "At least one field must be provided" },
  );

export const calcXResultIdSchema = z.object({
  id: z.string().min(1),
});

export type FluidType = z.infer<typeof fluidTypeSchema>;
export type CalcXResultItemDto = z.infer<typeof calcXResultItemSchema>;
export type SaveCalcXResultsRequest = z.infer<typeof saveCalcXResultsSchema>;
export type UpdateCalcXResultsRequest = z.infer<
  typeof updateCalcXResultsSchema
>;
export type CalcXResultIdParams = z.infer<typeof calcXResultIdSchema>;

export type CalcXResultDto = {
  id: string;
  number: number;
  fluidType: FluidType;
  objectName: string;
  results: CalcXResultItemDto[];
};

export type SaveCalcXResultsResponse = CalcXResultDto;
