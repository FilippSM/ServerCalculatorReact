import type { CalcXResult, CalcXResultItem } from "@prisma/client";
import { prisma } from "../../shared/db/prisma.js";
import type { SaveCalcXResultsRequest } from "./calc-x.schemas.js";

export type CalcXResultWithItems = CalcXResult & {
  items: CalcXResultItem[];
};

export class CalcXRepository {
  async create(data: SaveCalcXResultsRequest): Promise<CalcXResultWithItems> {
    return prisma.$transaction(async (tx) => {
      const last = await tx.calcXResult.findFirst({
        orderBy: { number: "desc" },
        select: { number: true },
      });

      const nextNumber = (last?.number ?? 0) + 1;

      return tx.calcXResult.create({
        data: {
          number: nextNumber,
          fluidType: data.fluidType,
          objectName: data.objectName,
          items: {
            create: data.results.map((item) => ({
              name: item.name,
              result: item.result,
              uncertainty: item.uncertainty,
            })),
          },
        },
        include: { items: true },
      });
    });
  }
}
