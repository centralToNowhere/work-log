import { FastifyInstance } from "fastify";
import UserDataProvider from "./user.dataProvider";
import UserService from "./user.service";
import { type CreateUserRequestParams } from "./types";

const usersRouter = (fastify: FastifyInstance) => {
    const dataProvider = new UserDataProvider(fastify.pg);
    const service = new UserService(dataProvider);

    fastify.get('/users', async () => {
        return service.getUsers();
    })

    fastify.post<{ Body: CreateUserRequestParams }>('/users', async (req, res) => {
        const user = await service.createUser(req.body);

        res.status(201);
        return user;
    })
}

export default usersRouter;
