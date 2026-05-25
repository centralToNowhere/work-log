"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const work_routes_1 = __importDefault(require("./modules/works/work.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const AppRouter = (fastify) => {
    fastify.register(work_routes_1.default);
    fastify.register(user_routes_1.default);
};
exports.default = AppRouter;
