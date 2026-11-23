import { randomUUID } from "node:crypto";
import type {
  OilTest,
  SaveOilTestDto,
  UpdateOilTestDto,
} from "./calc-x.dto.js";

// Temporary in-memory store until PostgreSQL is connected
const store: OilTest[] = [];

export class CalcXRepository {
  async findAll(): Promise<OilTest[]> {
    return [...store].sort((a, b) => b.date.localeCompare(a.date));
  }

  async findById(id: string): Promise<OilTest | null> {
    return store.find((record) => record.id === id) ?? null;
  }

  async create(data: SaveOilTestDto): Promise<OilTest> {
    const record: OilTest = {
      id: randomUUID(),
      date: data.date,
      results: data.results.map((item) => ({
        testId: item.testId,
        value: item.value,
      })),
    };

    store.push(record);
    return record;
  }

  async update(id: string, data: UpdateOilTestDto): Promise<OilTest> {
    const index = store.findIndex((record) => record.id === id);
    const existing = store[index];

    if (!existing) {
      throw new Error(`Oil test with id "${id}" not found`);
    }

    const updated: OilTest = {
      id: existing.id,
      date: data.date ?? existing.date,
      results:
        data.results !== undefined
          ? data.results.map((item) => ({
              testId: item.testId,
              value: item.value,
            }))
          : existing.results,
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
