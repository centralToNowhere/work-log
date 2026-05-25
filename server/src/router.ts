import { FastifyInstance } from 'fastify';
import workRoutes from './modules/works/work.routes'
import userRoutes from './modules/users/user.routes'

const AppRouter = (fastify: FastifyInstance) => {
    fastify.register(workRoutes);
    fastify.register(userRoutes);
}

export default AppRouter;
