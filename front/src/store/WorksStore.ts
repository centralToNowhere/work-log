import { types as t, Instance } from 'mobx-state-tree';
import { AsyncTask, runTask } from 'mst-async-task';
import { apiClient } from '@/api/apiClient';
import { CollectionPagination } from './tyoes';

const SortDirection = t.enumeration('SortDirection', ['asc', 'desc']);

const DateFilterMode = t.enumeration('DateFilterMode', ['all', 'byDate']);

const Work = t.model('Work', {
  id: t.number,
  title: t.string,
  description: t.optional(t.string, ''),
  amount: t.number,
  measureUnit: t.string,
  measureUnitValueSingularRu: t.string,
  workerId: t.number,
  workerFullName: t.string,
  createdAt: t.string,
});

type WorkDTO = {
  id: number;
  title: string;
  description?: string | null;
  amount: number | string;
  measureUnit: string;
  measureUnitValueSingularRu: string;
  workerId: number;
  workerFullName: string;
  created_at: string;
};

export type CreateWorkRequest = {
  title: string;
  description?: string | null;
  amount: number;
  measureUnit: string;
  workerId: number;
};

const WorksSortObject = t.model({
  name: t.maybe(SortDirection),
  createdAt: t.optional(SortDirection, 'desc'),
});

const WorksFilterObject = t.model({
  dateMode: t.optional(DateFilterMode, 'all'),
  date: t.maybe(t.string),
});

type GetWorksResponse = {
  data: WorkDTO[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

const WorksStore = t
  .model('WorksStore', {
    works: t.array(Work),
    loadWorksTask: t.optional(AsyncTask, {}),
    createWorkTask: t.optional(AsyncTask, {}),
    deleteWorkTask: t.optional(AsyncTask, {}),
    sort: t.optional(WorksSortObject, {}),
    filter: t.optional(WorksFilterObject, {}),
    pagination: t.optional(CollectionPagination, {
      page: 1,
      pageSize: 5,
      total: 0,
    }),
  })
  .actions((self) => {
    const loadWorks = (pagination?: { page: number; pageSize: number }) => {
      return runTask(self.loadWorksTask, function* ({ signal, exec }) {
        const page = pagination?.page || self.pagination.page;
        const pageSize = pagination?.pageSize || self.pagination.pageSize;
        const dateSort = self.sort.createdAt;
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          dateSort,
        });

        if (self.filter.dateMode === 'byDate' && self.filter.date) {
          params.set('date', self.filter.date);
        }

        const response: GetWorksResponse = yield apiClient.get(`/works?${params.toString()}`, {
          signal,
        });

        exec(() => {
          self.works.replace(response.data.map(normalizeWork));
          self.pagination.page = response.pagination.page;
          self.pagination.pageSize = response.pagination.pageSize;
          self.pagination.total = response.pagination.total;
        });
      });
    };

    const setDateSort = (dateSort: 'asc' | 'desc') => {
      self.sort.createdAt = dateSort;
    };

    const setDateFilterMode = (dateMode: 'all' | 'byDate') => {
      self.filter.dateMode = dateMode;
      self.pagination.page = 1;
    };

    const setDateFilter = (date?: string) => {
      self.filter.date = date;
      self.pagination.page = 1;
    };

    const deleteWork = (id: number) => {
      return runTask(self.deleteWorkTask, function* ({ signal, exec }) {
        yield apiClient.delete(`/works/${id}`, { signal });

        yield exec(loadWorks);
      });
    };

    const createWork = (work: CreateWorkRequest) => {
      return runTask(self.createWorkTask, function* ({ signal, exec }) {
        const createdWork: WorkDTO = yield apiClient.post('/works', work, { signal });

        exec(() => {
          self.pagination.page = 1;
          self.sort.createdAt = 'desc';
        });

        yield exec(loadWorks);

        return createdWork;
      });
    };

    return {
      loadWorks,
      setDateSort,
      setDateFilterMode,
      setDateFilter,
      createWork,
      deleteWork,
    };
  });

const normalizeWork = (work: WorkDTO) => ({
  id: work.id,
  title: work.title,
  description: work.description || '',
  amount: Number(work.amount),
  measureUnit: work.measureUnit,
  measureUnitValueSingularRu: work.measureUnitValueSingularRu,
  workerId: work.workerId,
  workerFullName: work.workerFullName,
  createdAt: work.created_at,
});

export type WorkInstance = Instance<typeof Work>;
export type WorksStoreInstance = Instance<typeof WorksStore>;

export default WorksStore;
