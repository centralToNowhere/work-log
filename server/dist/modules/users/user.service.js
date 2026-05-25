"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }
    async getUsers() {
        return this.dataProvider.fetchAll();
    }
    async createUser(user) {
        return this.dataProvider.create(user);
    }
}
exports.default = UserService;
