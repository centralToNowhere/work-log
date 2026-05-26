import { DeleteOutlined } from '@ant-design/icons';
import { WorkInstance } from '@/store/WorksStore';
import { Button, Popconfirm, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

type WorkTableRow = {
  id: number;
  title: string;
  description: string;
  amount: number;
  measureUnitValueSingularRu: string;
  workerFullName: string;
  createdAt: string;
};

type WorksTableProps = {
  works: WorkInstance[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  dateSort: 'asc' | 'desc';
  loading?: boolean;
  deleting?: boolean;
  onChange: (params: { page: number; pageSize: number; dateSort: 'asc' | 'desc' }) => void;
  onDelete: (id: number) => void;
};

const WorksTable = ({
  works,
  pagination,
  dateSort,
  loading,
  deleting,
  onChange,
  onDelete,
}: WorksTableProps) => {
  const dataSource: WorkTableRow[] = works.map((work) => ({
    id: work.id,
    title: work.title,
    description: work.description,
    amount: work.amount,
    measureUnitValueSingularRu: work.measureUnitValueSingularRu,
    workerFullName: work.workerFullName,
    createdAt: work.createdAt,
  }));

  const columns: ColumnsType<WorkTableRow> = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      render: (description?: string) => description || '-',
    },
    {
      title: 'Количество',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
    },
    {
      title: 'Ед. изм.',
      dataIndex: 'measureUnitValueSingularRu',
      key: 'measureUnitValueSingularRu',
    },
    {
      title: 'Исполнитель',
      dataIndex: 'workerFullName',
      key: 'workerFullName',
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: dateSort === 'asc' ? 'ascend' : 'descend',
      sortDirections: ['descend', 'ascend'],
      render: (createdAt: string) => {
        return new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(createdAt));
      },
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      width: 64,
      render: (_, work) => (
        <Popconfirm
          title="Удалить работу?"
          okText="Удалить"
          cancelText="Отмена"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(work.id)}
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined style={{ fontSize: 16 }} />}
            loading={deleting}
            aria-label="Удалить работу"
          />
        </Popconfirm>
      ),
    },
  ];

  const handleChange: TableProps<WorkTableRow>['onChange'] = (tablePagination, _, sorter) => {
    const currentSorter = Array.isArray(sorter)
      ? sorter.find((item) => item.columnKey === 'createdAt')
      : sorter;
    const sortOrder = currentSorter?.order === 'ascend' ? 'asc' : 'desc';

    onChange({
      page: tablePagination.current || pagination.page,
      pageSize: tablePagination.pageSize || pagination.pageSize,
      dateSort: sortOrder,
    });
  };

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      onChange={handleChange}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger: true,
        showTotal: (total) => `Всего: ${total}`,
      }}
    />
  );
};

export default WorksTable;
