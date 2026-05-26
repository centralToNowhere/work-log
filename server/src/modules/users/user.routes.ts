import { FastifyInstance } from 'fastify';
import UserDataProvider from './user.dataProvider';
import UserService from './user.service';
import { type CreateUserRequestParams } from './types';

const usersRouter = (fastify: FastifyInstance) => {
  const dataProvider = new UserDataProvider(fastify.pg);
  const service = new UserService(dataProvider);

  const getUsers = async () => {
    return service.getUsers();
  };

  const createUser = async (
    req: { body: CreateUserRequestParams },
    res: { status: (code: number) => void },
  ) => {
    const user = await service.createUser(req.body);

    res.status(201);
    return user;
  };

  fastify.get('/users', getUsers);
  fastify.get('/workers', getUsers);

  fastify.post<{ Body: CreateUserRequestParams }>('/users', createUser);
  fastify.post<{ Body: CreateUserRequestParams }>('/workers', createUser);
};

export default usersRouter;
