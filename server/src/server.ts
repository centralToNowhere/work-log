import Fastify from 'fastify';
import { FastifyError } from 'fastify';
import router from './router';
import dbConnector from './db';
import dotenv from 'dotenv';
import AppError from './errors/error.app';

dotenv.config();

const fastify = Fastify({
    logger: true
})

fastify.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error({ err: error }, 'Request failed');

    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }

    if (!error.statusCode || error.statusCode >= 500) {
        const appError = new AppError();

        return reply.status(appError.statusCode).send({
            message: appError.message
        });
    }

    return reply.status(error.statusCode).send({
        message: error.message
    });
})

fastify.register(dbConnector);
fastify.register(router);

const port = process.env.BACKEND_PORT;

if (!port) {
  throw new Error('BACKEND_PORT is not defined')
}

fastify.listen({
    port: Number(port),
    host: '0.0.0.0'
})
