export type UserDTO = {
  id: number;
  firstName: string;
  lastName: string;
  patronymic: string;
  fullName: string;
};

export type CreateUserRequestParams = {
  firstName: string;
  lastName: string;
  patronymic?: string;
};
