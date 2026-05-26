"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const work_dataProvider_1 = __importDefault(require("./work.dataProvider"));
const work_service_1 = __importDefault(require("./work.service"));
const worksRouter = (fastify) => {
    const dataProvider = new work_dataProvider_1.default(fastify.pg);
    const service = new work_service_1.default(dataProvider);
    fastify.get('/works', async (req) => {
        const sort = {
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
    fastify.post('/works', async (req, res) => {
        const work = await service.createWork(req.body);
        res.status(201);
        return work;
    });
    fastify.delete('/works/:id', async (req, res) => {
        await service.deleteWork(req.params);
        return res.status(204).send();
    });
};
exports.default = worksRouter;
