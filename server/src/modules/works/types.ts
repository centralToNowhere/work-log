export type GetWorksSortOrder = {
  byDate: 'asc' | 'desc';
};
export type GetWorksFilter = {
  byDate?: string;
};

export type GetWorksPaginationInput = {
  page: number;
  pageSize: number;
};

export type GetWorksPaginationOutput = {
  page: number;
  pageSize: number;
  total: number;
};

export type GetWorksResponse = {
  data: WorkDTO[];
  pagination: GetWorksPaginationOutput;
};

export type WorkDTO = {
  id?: number;
  title: string;
  description?: string | null;
  amount: number;
  measureUnit: string;
  measureUnitValueSingularRu: string;
  workerId: number;
  workerFullName: string;
  created_at: Date;
};

export type GetWorksQuery = {
  dateSort?: GetWorksSortOrder['byDate'];
  date?: string;
  page?: string;
  pageSize?: string;
};

export type CreateWorkRequestParams = {
  title: string;
  description?: string | null;
  amount: number;
  measureUnit: string;
  workerId: number;
  createdAt?: string;
};

export type DeleteWorkRequestParams = {
  id: string;
};
