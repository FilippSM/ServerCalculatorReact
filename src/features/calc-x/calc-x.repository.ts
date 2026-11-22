import { randomUUID } from "node:crypto";
import type {
  FluidType,
  SaveCalcXResultsRequest,
  UpdateCalcXResultsRequest,
} from "./calc-x.schemas.js";

export type CalcXResultItem = {
  id: string;
  name: string;
  result: string;
  uncertainty: string;
};

export type CalcXResultWithItems = {
  id: string;
  number: number;
  fluidType: FluidType;
  objectName: string;
  createdAt: Date;
  items: CalcXResultItem[];
};

// Temporary in-memory store until PostgreSQL is connected
const store: CalcXResultWithItems[] = [];

export class CalcXRepository {
  async findAll(): Promise<CalcXResultWithItems[]> {
    return [...store].sort((a, b) => b.number - a.number);
  }

  async findById(id: string): Promise<CalcXResultWithItems | null> {
    return store.find((record) => record.id === id) ?? null;
  }

  async create(data: SaveCalcXResultsRequest): Promise<CalcXResultWithItems> {
    const nextNumber =
      store.reduce((max, record) => Math.max(max, record.number), 0) + 1;

    const record: CalcXResultWithItems = {
      id: randomUUID(),
      number: nextNumber,
      fluidType: data.fluidType,
      objectName: data.objectName,
      createdAt: new Date(),
      items: data.results.map((item) => ({
        id: randomUUID(),
        name: item.name,
        result: item.result,
        uncertainty: item.uncertainty,
      })),
    };

    store.push(record);
    return record;
  }

  async update(
    id: string,
    data: UpdateCalcXResultsRequest,
  ): Promise<CalcXResultWithItems> {
    const index = store.findIndex((record) => record.id === id);
    const existing = store[index];

    if (!existing) {
      throw new Error(`CalcX result with id "${id}" not found`);
    }

    const updated: CalcXResultWithItems = {
      ...existing,
      fluidType: data.fluidType ?? existing.fluidType,
      objectName: data.objectName ?? existing.objectName,
      items:
        data.results !== undefined
          ? data.results.map((item) => ({
              id: randomUUID(),
              name: item.name,
              result: item.result,
              uncertainty: item.uncertainty,
            }))
          : existing.items,
    };

    store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = store.findIndex((record) => record.id === id);
    if (index !== -1) {
      store.splice(index, 1);
    }
  }
}
