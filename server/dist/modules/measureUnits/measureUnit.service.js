"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MeasureUnitService {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }
    async getMeasureUnits() {
        return this.dataProvider.fetchAll();
    }
    async createMeasureUnit(measureUnit) {
        return this.dataProvider.create(measureUnit);
    }
}
exports.default = MeasureUnitService;
