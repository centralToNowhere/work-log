import { Button, Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import { MeasureUnitInstance } from '@/store/MeasureUnitsStore';
import { WorkerInstance } from '@/store/WorkersStore';
import { addWorkFormSchema, type AddWorkFormValues } from './schema';

type AddWorkFormProps = {
  open: boolean;
  workers: WorkerInstance[];
  measureUnits: MeasureUnitInstance[];
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: AddWorkFormValues) => Promise<void>;
};

const initialValues: Partial<AddWorkFormValues> = {
  workerMode: 'existing',
  measureUnitMode: 'existing',
};

const AddWorkForm = ({
  open,
  workers,
  measureUnits,
  loading,
  onCancel,
  onSubmit,
}: AddWorkFormProps) => {
  const [form] = Form.useForm<AddWorkFormValues>();
  const workerMode = Form.useWatch('workerMode', form);
  const measureUnitMode = Form.useWatch('measureUnitMode', form);

  const handleFinish = async (values: AddWorkFormValues) => {
    const parsedValues = addWorkFormSchema.safeParse(values);

    if (!parsedValues.success) {
      form.setFields(
        parsedValues.error.issues.map((issue) => ({
          name: issue.path[0] as keyof AddWorkFormValues,
          errors: [issue.message],
        })),
      );
      return;
    }

    await onSubmit(parsedValues.data);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Добавить работу"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Добавить
        </Button>,
      ]}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleFinish}>
        <Form.Item name="title" label="Название">
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="amount" label="Количество">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="measureUnitMode" label="Единица измерения">
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={[
              { value: 'existing', label: 'Выбрать' },
              { value: 'new', label: 'Добавить новую' },
            ]}
          />
        </Form.Item>

        {measureUnitMode === 'new' ? (
          <>
            <Form.Item name="newMeasureUnitCode" label="Код единицы измерения">
              <Input placeholder="Например: kg" />
            </Form.Item>

            <Form.Item name="newMeasureUnitValueSingularRu" label="Название в единственном числе">
              <Input placeholder="Например: килограмм" />
            </Form.Item>
          </>
        ) : (
          <Form.Item name="measureUnit" label="Единица измерения">
            <Select
              showSearch
              optionFilterProp="label"
              options={measureUnits.map((measureUnit) => ({
                value: measureUnit.code,
                label: `${measureUnit.valueSingularRu} (${measureUnit.code})`,
              }))}
            />
          </Form.Item>
        )}

        <Form.Item name="workerMode" label="Работник">
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={[
              { value: 'existing', label: 'Выбрать' },
              { value: 'new', label: 'Добавить нового' },
            ]}
          />
        </Form.Item>

        {workerMode === 'new' ? (
          <>
            <Form.Item name="lastName" label="Фамилия">
              <Input />
            </Form.Item>

            <Form.Item name="firstName" label="Имя">
              <Input />
            </Form.Item>

            <Form.Item name="patronymic" label="Отчество">
              <Input />
            </Form.Item>
          </>
        ) : (
          <Form.Item name="workerId" label="Работник">
            <Select
              showSearch
              optionFilterProp="label"
              options={workers.map((worker) => ({
                value: worker.id,
                label: worker.fullName,
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export type { AddWorkFormValues };
export default AddWorkForm;
