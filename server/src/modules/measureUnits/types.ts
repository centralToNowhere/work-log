export type MeasureUnitDTO = {
  id: number;
  code: string;
  valueSingularRu: string;
};

export type CreateMeasureUnitRequestParams = {
  code: string;
  valueSingularRu: string;
};
