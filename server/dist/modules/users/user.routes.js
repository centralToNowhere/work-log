"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_dataProvider_1 = __importDefault(require("./user.dataProvider"));
const user_service_1 = __importDefault(require("./user.service"));
const usersRouter = (fastify) => {
    const dataProvider = new user_dataProvider_1.default(fastify.pg);
    const service = new user_service_1.default(dataProvider);
    fastify.get('/users', async () => {
        return service.getUsers();
    });
    fastify.post('/users', async (req, res) => {
        const user = await service.createUser(req.body);
        res.status(201);
        return user;
    });
};
exports.default = usersRouter;
