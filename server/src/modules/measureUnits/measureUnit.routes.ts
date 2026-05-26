import { FastifyInstance } from 'fastify';
import MeasureUnitDataProvider from './measureUnit.dataProvider';
import MeasureUnitService from './measureUnit.service';
import { type CreateMeasureUnitRequestParams } from './types';

const measureUnitsRouter = (fastify: FastifyInstance) => {
  const dataProvider = new MeasureUnitDataProvider(fastify.pg);
  const service = new MeasureUnitService(dataProvider);

  fastify.get('/measureUnits', async () => {
    return service.getMeasureUnits();
  });

  fastify.post<{ Body: CreateMeasureUnitRequestParams }>('/measureUnits', async (req, res) => {
    const measureUnit = await service.createMeasureUnit(req.body);

    res.status(201);
    return measureUnit;
  });
};

export default measureUnitsRouter;
