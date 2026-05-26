class AppError extends Error {
  statusCode: number = 500;

  constructor(message: string = 'Ошибка сервера. Попробуйте позже.', code: number = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = code;
  }
}

export default AppError;
