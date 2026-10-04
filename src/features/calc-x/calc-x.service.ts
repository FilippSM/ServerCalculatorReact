import type { CalcXRepository } from "./calc-x.repository.js";
import type {
  SaveCalcXResultsRequest,
  SaveCalcXResultsResponse,
} from "./calc-x.schemas.js";

export class CalcXService {
  constructor(private readonly calcXRepository: CalcXRepository) {}

  async saveResults(
    data: SaveCalcXResultsRequest,
  ): Promise<SaveCalcXResultsResponse> {
    const saved = await this.calcXRepository.create(data);

    return {
      id: saved.id,
      number: saved.number,
      fluidType: saved.fluidType,
      objectName: saved.objectName,
      results: saved.items.map((item) => ({
        name: item.name,
        result: item.result,
        uncertainty: item.uncertainty,
      })),
    };
  }
}
