"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message = 'Ошибка сервера. Попробуйте позже.', code = 500) {
        super(message);
        this.statusCode = 500;
        this.name = 'AppError';
        this.statusCode = code;
    }
}
exports.default = AppError;
