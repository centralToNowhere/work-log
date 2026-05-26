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
    const getUsers = async () => {
        return service.getUsers();
    };
    const createUser = async (req, res) => {
        const user = await service.createUser(req.body);
        res.status(201);
        return user;
    };
    fastify.get('/users', getUsers);
    fastify.get('/workers', getUsers);
    fastify.post('/users', createUser);
    fastify.post('/workers', createUser);
};
exports.default = usersRouter;
