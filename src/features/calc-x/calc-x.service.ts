import { NotFoundError } from "../../shared/errors/index.js";
import type { CalcXRepository } from "./calc-x.repository.js";
import type {
  OilTest,
  OilTestList,
  SaveOilTestDto,
  UpdateOilTestDto,
} from "./calc-x.dto.js";

export class CalcXService {
  constructor(private readonly calcXRepository: CalcXRepository) {}

  async getAll(): Promise<OilTestList> {
    return this.calcXRepository.findAll();
  }

  async getById(id: string): Promise<OilTest> {
    return this.ensureExists(id);
  }

  async save(data: SaveOilTestDto): Promise<OilTest> {
    return this.calcXRepository.create(data);
  }

  async update(id: string, data: UpdateOilTestDto): Promise<OilTest> {
    await this.ensureExists(id);
    return this.calcXRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.calcXRepository.delete(id);
  }

  private async ensureExists(id: string): Promise<OilTest> {
    const existing = await this.calcXRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Oil test with id "${id}" not found`);
    }

    return existing;
  }
}
