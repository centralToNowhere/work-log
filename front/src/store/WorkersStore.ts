import { types as t, Instance } from 'mobx-state-tree';
import { AsyncTask, runTask } from 'mst-async-task';
import { apiClient } from '@/api/apiClient';

const Worker = t.model({
  id: t.number,
  firstName: t.string,
  lastName: t.string,
  patronymic: t.optional(t.string, ''),
  fullName: t.string,
});

export type CreateWorkerRequest = {
  firstName: string;
  lastName: string;
  patronymic?: string;
};

const WorkersStore = t
  .model('WorkersStore', {
    workers: t.array(Worker),
    loadWorkersTask: t.optional(AsyncTask, {}),
    createWorkerTask: t.optional(AsyncTask, {}),
  })
  .actions((self) => ({
    loadWorkers() {
      return runTask(self.loadWorkersTask, function* ({ signal, exec }) {
        const workers: WorkerInstance[] = yield apiClient.get('/workers', { signal });

        exec(() => {
          self.workers.replace(workers);
        });
      });
    },

    createWorker(worker: CreateWorkerRequest) {
      return runTask(self.createWorkerTask, function* ({ signal, exec }) {
        const createdWorker: WorkerInstance = yield apiClient.post('/workers', worker, { signal });

        exec(() => {
          self.workers.push(createdWorker);
        });

        return createdWorker;
      });
    },
  }));

export type WorkerInstance = Instance<typeof Worker>;
export type WorkersStoreInstance = Instance<typeof WorkersStore>;

export default WorkersStore;
