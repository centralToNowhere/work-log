"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const measureUnit_dataProvider_1 = __importDefault(require("./measureUnit.dataProvider"));
const measureUnit_service_1 = __importDefault(require("./measureUnit.service"));
const measureUnitsRouter = (fastify) => {
    const dataProvider = new measureUnit_dataProvider_1.default(fastify.pg);
    const service = new measureUnit_service_1.default(dataProvider);
    fastify.get('/measureUnits', async () => {
        return service.getMeasureUnits();
    });
    fastify.post('/measureUnits', async (req, res) => {
        const measureUnit = await service.createMeasureUnit(req.body);
        res.status(201);
        return measureUnit;
    });
};
exports.default = measureUnitsRouter;
