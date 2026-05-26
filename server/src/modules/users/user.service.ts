import UserDataProvider from './user.dataProvider';
import { type CreateUserRequestParams, type UserDTO } from './types';

class UserService {
  dataProvider: UserDataProvider;

  constructor(dataProvider: UserDataProvider) {
    this.dataProvider = dataProvider;
  }

  async getUsers(): Promise<UserDTO[]> {
    return this.dataProvider.fetchAll();
  }

  async createUser(user: CreateUserRequestParams): Promise<UserDTO> {
    return this.dataProvider.create(user);
  }
}

export default UserService;
