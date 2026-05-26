import { types as t, Instance } from 'mobx-state-tree';
import { AsyncTask, runTask } from 'mst-async-task';
import { apiClient } from '@/api/apiClient';

const MeasureUnit = t.model({
  id: t.number,
  code: t.string,
  valueSingularRu: t.string,
});

export type CreateMeasureUnitRequest = {
  code: string;
  valueSingularRu: string;
};

const MeasureUnitsStore = t
  .model('MeasureUnitsStore', {
    measureUnits: t.array(MeasureUnit),
    loadMeasureUnitsTask: t.optional(AsyncTask, {}),
    createMeasureUnitTask: t.optional(AsyncTask, {}),
  })
  .actions((self) => ({
    loadMeasureUnits() {
      return runTask(self.loadMeasureUnitsTask, function* ({ signal, exec }) {
        const measureUnits: MeasureUnitInstance[] = yield apiClient.get('/measureUnits', {
          signal,
        });

        exec(() => {
          self.measureUnits.replace(measureUnits);
        });
      });
    },

    createMeasureUnit(measureUnit: CreateMeasureUnitRequest) {
      return runTask(self.createMeasureUnitTask, function* ({ signal, exec }) {
        const createdMeasureUnit: MeasureUnitInstance = yield apiClient.post(
          '/measureUnits',
          measureUnit,
          { signal },
        );

        exec(() => {
          const measureUnitIndex = self.measureUnits.findIndex(
            (unit) => unit.id === createdMeasureUnit.id,
          );

          if (measureUnitIndex >= 0) {
            self.measureUnits[measureUnitIndex] = createdMeasureUnit;
            return;
          }

          self.measureUnits.push(createdMeasureUnit);
        });

        return createdMeasureUnit;
      });
    },
  }));

export type MeasureUnitInstance = Instance<typeof MeasureUnit>;
export type MeasureUnitsStoreInstance = Instance<typeof MeasureUnitsStore>;
export default MeasureUnitsStore;
