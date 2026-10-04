import type { CalcXResult, CalcXResultItem } from "@prisma/client";
import { prisma } from "../../shared/db/prisma.js";
import type {
  SaveCalcXResultsRequest,
  UpdateCalcXResultsRequest,
} from "./calc-x.schemas.js";

export type CalcXResultWithItems = CalcXResult & {
  items: CalcXResultItem[];
};

export class CalcXRepository {
  async findAll(): Promise<CalcXResultWithItems[]> {
    return prisma.calcXResult.findMany({
      include: { items: true },
      orderBy: { number: "desc" },
    });
  }

  async findById(id: string): Promise<CalcXResultWithItems | null> {
    return prisma.calcXResult.findUnique({
      where: { id },
      include: { items: true },
    });
  }

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

  async update(
    id: string,
    data: UpdateCalcXResultsRequest,
  ): Promise<CalcXResultWithItems> {
    return prisma.$transaction(async (tx) => {
      if (data.results !== undefined) {
        await tx.calcXResultItem.deleteMany({ where: { calcXResultId: id } });
      }

      return tx.calcXResult.update({
        where: { id },
        data: {
          ...(data.fluidType !== undefined
            ? { fluidType: data.fluidType }
            : {}),
          ...(data.objectName !== undefined
            ? { objectName: data.objectName }
            : {}),
          ...(data.results !== undefined
            ? {
                items: {
                  create: data.results.map((item) => ({
                    name: item.name,
                    result: item.result,
                    uncertainty: item.uncertainty,
                  })),
                },
              }
            : {}),
        },
        include: { items: true },
      });
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.calcXResult.delete({ where: { id } });
  }
}
