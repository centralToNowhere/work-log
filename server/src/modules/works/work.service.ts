import WorkDataProvider from './work.dataProvider';
import AppError from '@/errors/error.app';
import {
  CreateWorkRequestParams,
  GetWorksSortOrder,
  GetWorksFilter,
  GetWorksPaginationInput,
  GetWorksResponse,
  WorkDTO,
  DeleteWorkRequestParams,
} from './types';

class WorkService {
  dataProvider: WorkDataProvider;

  constructor(dataProvider: WorkDataProvider) {
    this.dataProvider = dataProvider;
  }

  async getWorks(
    sort: GetWorksSortOrder,
    filter: GetWorksFilter,
    pagination: GetWorksPaginationInput,
  ): Promise<GetWorksResponse> {
    return this.dataProvider.fetchAll(sort, filter, pagination);
  }

  async createWork(work: CreateWorkRequestParams): Promise<WorkDTO> {
    return this.dataProvider.create(work);
  }

  async deleteWork(params: DeleteWorkRequestParams): Promise<void> {
    const deleted = await this.dataProvider.delete(params.id);

    if (!deleted) {
      throw new AppError('Работа не найдена', 404);
    }
  }
}

export default WorkService;
