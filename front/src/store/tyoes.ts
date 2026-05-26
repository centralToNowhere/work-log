import { types as t } from 'mobx-state-tree';

export const CollectionPagination = t.model({
  page: t.optional(t.number, 1),
  pageSize: t.optional(t.number, 20),
  total: t.optional(t.number, 0),
});
