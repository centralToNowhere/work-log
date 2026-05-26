import { types, Instance } from 'mobx-state-tree';
import WorkersStore from './WorkersStore';
import WorksStore from './WorksStore';
import MeasureUnitsStore from './MeasureUnitsStore';

const CoreStore = types
  .model('CoreStore', {
    status: 'Loading', // 'Loading' | 'Ready'
    workersStore: WorkersStore,
    measureUnitsStore: MeasureUnitsStore,
    worksStore: WorksStore,
  })
  .actions((self) => ({
    setStatus(status: string) {
      self.status = status;
    },
  }));

export type CoreStoreInstance = Instance<typeof CoreStore>;

export function createStore(): CoreStoreInstance {
  const store = CoreStore.create({
    status: 'Loading',
    workersStore: WorkersStore.create(),
    worksStore: WorksStore.create(),
    measureUnitsStore: MeasureUnitsStore.create(),
  });

  return store;
}

export default CoreStore;
