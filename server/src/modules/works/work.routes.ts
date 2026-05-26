import { FastifyInstance } from 'fastify';
import WorkDataProvider from './work.dataProvider';
import WorkService from './work.service';
import {
  GetWorksQuery,
  GetWorksSortOrder,
  CreateWorkRequestParams,
  DeleteWorkRequestParams,
} from './types';

const worksRouter = (fastify: FastifyInstance) => {
  const dataProvider = new WorkDataProvider(fastify.pg);
  const service = new WorkService(dataProvider);

  fastify.get<{ Querystring: GetWorksQuery }>('/works', async (req) => {
    const sort: GetWorksSortOrder = {
      byDate: req.query.dateSort === 'asc' ? 'asc' : 'desc',
    };
    const filter = {
      byDate: req.query.date,
    };
    const pagination = {
      page: Number(req.query.page || 1),
      pageSize: Number(req.query.pageSize || 10),
    };

    return service.getWorks(sort, filter, pagination);
  });

  fastify.post<{ Body: CreateWorkRequestParams }>('/works', async (req, res) => {
    const work = await service.createWork(req.body);

    res.status(201);
    return work;
  });

  fastify.delete<{ Params: DeleteWorkRequestParams }>('/works/:id', async (req, res) => {
    await service.deleteWork(req.params);

    return res.status(204).send();
  });
};

export default worksRouter;
