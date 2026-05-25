"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_app_1 = __importDefault(require("@/errors/error.app"));
class WorkService {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }
    async getWorks(sort, filter) {
        return this.dataProvider.fetchAll(sort, filter);
    }
    async createWork(work) {
        return this.dataProvider.create(work);
    }
    async deleteWork(params) {
        const deleted = await this.dataProvider.delete(params.id);
        if (!deleted) {
            throw new error_app_1.default('Работа не найдена', 404);
        }
    }
}
exports.default = WorkService;
