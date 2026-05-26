import MeasureUnitDataProvider from './measureUnit.dataProvider';
import { type CreateMeasureUnitRequestParams, type MeasureUnitDTO } from './types';

class MeasureUnitService {
  dataProvider: MeasureUnitDataProvider;

  constructor(dataProvider: MeasureUnitDataProvider) {
    this.dataProvider = dataProvider;
  }

  async getMeasureUnits(): Promise<MeasureUnitDTO[]> {
    return this.dataProvider.fetchAll();
  }

  async createMeasureUnit(measureUnit: CreateMeasureUnitRequestParams): Promise<MeasureUnitDTO> {
    return this.dataProvider.create(measureUnit);
  }
}

export default MeasureUnitService;
