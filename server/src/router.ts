import { FastifyInstance } from 'fastify';
import workRoutes from './modules/works/work.routes';
import userRoutes from './modules/users/user.routes';
import measureUnitRoutes from './modules/measureUnits/measureUnit.routes';

const AppRouter = (fastify: FastifyInstance) => {
  fastify.register(workRoutes);
  fastify.register(userRoutes);
  fastify.register(measureUnitRoutes);
};

export default AppRouter;
