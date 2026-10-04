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

export type FluidType = z.infer<typeof fluidTypeSchema>;
export type CalcXResultItemDto = z.infer<typeof calcXResultItemSchema>;
export type SaveCalcXResultsRequest = z.infer<typeof saveCalcXResultsSchema>;

export type SaveCalcXResultsResponse = {
  id: string;
  number: number;
  fluidType: FluidType;
  objectName: string;
  results: CalcXResultItemDto[];
};
