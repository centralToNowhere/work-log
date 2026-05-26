import { CommonLayout } from '@/layouts';
import { Button, DatePicker, Space, Typography, Radio, message, RadioChangeEvent } from 'antd';
import { WorksTable } from './components/WorksTable';
import { AddWorkForm, AddWorkFormValues } from './components/AddWorkForm';
import { useStore } from '@/store/StoreContextProvider';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

const WorksPage = () => {
  const [isAddWorkModalOpen, setIsAddWorkModalOpen] = useState(false);
  const store = useStore();
  const {
    works,
    pagination,
    sort,
    filter,
    loadWorks,
    setDateSort,
    setDateFilterMode,
    setDateFilter,
    loadWorksTask,
    createWork,
    createWorkTask,
    deleteWork,
    deleteWorkTask,
  } = store.worksStore;
  const { workers, loadWorkers, loadWorkersTask, createWorker, createWorkerTask } =
    store.workersStore;
  const {
    measureUnits,
    loadMeasureUnits,
    loadMeasureUnitsTask,
    createMeasureUnit,
    createMeasureUnitTask,
  } = store.measureUnitsStore;

  useEffect(() => {
    loadWorks();
    loadWorkers();
    loadMeasureUnits();

    return () => {
      loadWorksTask.abort();
      loadWorkersTask.abort();
      loadMeasureUnitsTask.abort();
    };
  }, [
    loadWorks,
    loadWorksTask,
    loadWorkers,
    loadWorkersTask,
    loadMeasureUnits,
    loadMeasureUnitsTask,
  ]);

  const handleAddWork = async (values: AddWorkFormValues) => {
    try {
      const createWorkerResult =
        values.workerMode === 'new'
          ? await createWorker({
              firstName: values.firstName!,
              lastName: values.lastName!,
              patronymic: values.patronymic || '',
            })
          : null;

      if (createWorkerResult?.error) {
        throw createWorkerResult.error;
      }

      const workerId =
        values.workerMode === 'new' ? createWorkerResult!.value.id : values.workerId!;

      const createMeasureUnitResult =
        values.measureUnitMode === 'new'
          ? await createMeasureUnit({
              code: values.newMeasureUnitCode!,
              valueSingularRu: values.newMeasureUnitValueSingularRu!,
            })
          : null;

      if (createMeasureUnitResult?.error) {
        throw createMeasureUnitResult.error;
      }

      const measureUnit =
        values.measureUnitMode === 'new'
          ? createMeasureUnitResult!.value.code
          : values.measureUnit!;

      const createWorkResult = await createWork({
        title: values.title,
        description: values.description || null,
        amount: values.amount,
        measureUnit,
        workerId,
      });

      if (createWorkResult.error) {
        throw createWorkResult.error;
      }

      setIsAddWorkModalOpen(false);
      message.success('Работа добавлена');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Не удалось добавить работу');
    }
  };

  const handleDeleteWork = async (id: number) => {
    const deleteWorkResult = await deleteWork(id);

    if (deleteWorkResult.error) {
      message.error(deleteWorkResult.error.message);
      return;
    }

    message.success('Работа удалена');
  };

  const handleTableChange = (params: {
    page: number;
    pageSize: number;
    dateSort: 'asc' | 'desc';
  }) => {
    setDateSort(params.dateSort);
    loadWorks({
      page: params.page,
      pageSize: params.pageSize,
    });
  };

  const handleDateFilterChange = (date: Dayjs | null) => {
    setDateFilter(date?.format('YYYY-MM-DD'));
    loadWorks({
      page: 1,
      pageSize: pagination.pageSize,
    });
  };

  const onChangeByDateFilter = (e: RadioChangeEvent) => {
    const value = e.target.value === 'byDate' ? 'byDate' : 'all';

    setDateFilterMode(value);
    loadWorks({
      page: 1,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <CommonLayout
      headerTitle={<Typography.Title>Журнал работ</Typography.Title>}
      headerExtra={
        <Space>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={filter.dateMode}
            options={[
              { value: 'all', label: 'Все' },
              { value: 'byDate', label: 'По дате' },
            ]}
            onChange={onChangeByDateFilter}
          />

          <DatePicker
            disabled={filter.dateMode !== 'byDate'}
            value={filter.date ? dayjs(filter.date) : null}
            placeholder="Дата"
            onChange={handleDateFilterChange}
          />

          <Button type="primary" onClick={() => setIsAddWorkModalOpen(true)}>
            Добавить работу
          </Button>
        </Space>
      }
    >
      <WorksTable
        works={works}
        pagination={pagination}
        dateSort={sort.createdAt}
        loading={loadWorksTask.pending}
        deleting={deleteWorkTask.pending}
        onChange={handleTableChange}
        onDelete={handleDeleteWork}
      />

      <AddWorkForm
        open={isAddWorkModalOpen}
        workers={workers}
        measureUnits={measureUnits}
        loading={
          createWorkTask.pending || createWorkerTask.pending || createMeasureUnitTask.pending
        }
        onCancel={() => setIsAddWorkModalOpen(false)}
        onSubmit={handleAddWork}
      />
    </CommonLayout>
  );
};

export default observer(WorksPage);
