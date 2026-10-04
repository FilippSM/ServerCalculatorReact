import { NotFoundError } from "../../shared/errors/index.js";
import type {
  CalcXRepository,
  CalcXResultWithItems,
} from "./calc-x.repository.js";
import type {
  CalcXResultDto,
  SaveCalcXResultsRequest,
  UpdateCalcXResultsRequest,
} from "./calc-x.schemas.js";

export class CalcXService {
  constructor(private readonly calcXRepository: CalcXRepository) {}

  async getAll(): Promise<CalcXResultDto[]> {
    const records = await this.calcXRepository.findAll();
    return records.map((record) => this.toDto(record));
  }

  async saveResults(data: SaveCalcXResultsRequest): Promise<CalcXResultDto> {
    const saved = await this.calcXRepository.create(data);
    return this.toDto(saved);
  }

  async update(
    id: string,
    data: UpdateCalcXResultsRequest,
  ): Promise<CalcXResultDto> {
    await this.ensureExists(id);
    const updated = await this.calcXRepository.update(id, data);
    return this.toDto(updated);
  }

  async delete(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.calcXRepository.delete(id);
  }

  private async ensureExists(id: string): Promise<void> {
    const existing = await this.calcXRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`CalcX result with id "${id}" not found`);
    }
  }

  private toDto(record: CalcXResultWithItems): CalcXResultDto {
    return {
      id: record.id,
      number: record.number,
      fluidType: record.fluidType,
      objectName: record.objectName,
      results: record.items.map((item) => ({
        name: item.name,
        result: item.result,
        uncertainty: item.uncertainty,
      })),
    };
  }
}
