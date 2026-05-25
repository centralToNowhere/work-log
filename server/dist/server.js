"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const router_1 = __importDefault(require("./router"));
const db_1 = __importDefault(require("./db"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_app_1 = __importDefault(require("./errors/error.app"));
dotenv_1.default.config();
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'Request failed');
    if (error instanceof error_app_1.default) {
        return reply.status(error.statusCode).send({
            message: error.message
        });
    }
    if (!error.statusCode || error.statusCode >= 500) {
        const appError = new error_app_1.default();
        return reply.status(appError.statusCode).send({
            message: appError.message
        });
    }
    return reply.status(error.statusCode).send({
        message: error.message
    });
});
fastify.register(db_1.default);
fastify.register(router_1.default);
const port = process.env.BACKEND_PORT;
if (!port) {
    throw new Error('BACKEND_PORT is not defined');
}
fastify.listen({
    port: Number(port),
    host: '0.0.0.0'
});
