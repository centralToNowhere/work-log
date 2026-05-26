import { z } from 'zod';

const workerModeSchema = z.enum(['existing', 'new']);
const measureUnitModeSchema = z.enum(['existing', 'new']);

export const addWorkFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Введите название работы'),
    description: z.string().trim().optional(),
    amount: z.number({ error: 'Введите количество' }).positive('Количество должно быть больше 0'),
    measureUnitMode: measureUnitModeSchema,
    measureUnit: z.string().trim().optional(),
    newMeasureUnitCode: z.string().trim().optional(),
    newMeasureUnitValueSingularRu: z.string().trim().optional(),
    workerMode: workerModeSchema,
    workerId: z.number().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    patronymic: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.measureUnitMode === 'existing' && !value.measureUnit) {
      ctx.addIssue({
        code: 'custom',
        path: ['measureUnit'],
        message: 'Выберите единицу измерения',
      });
    }

    if (value.measureUnitMode === 'new' && !value.newMeasureUnitCode) {
      ctx.addIssue({
        code: 'custom',
        path: ['newMeasureUnitCode'],
        message: 'Введите единицу измерения',
      });
    }

    if (value.measureUnitMode === 'new' && !value.newMeasureUnitValueSingularRu) {
      ctx.addIssue({
        code: 'custom',
        path: ['newMeasureUnitValueSingularRu'],
        message: 'Введите название на русском',
      });
    }

    if (value.workerMode === 'existing' && !value.workerId) {
      ctx.addIssue({
        code: 'custom',
        path: ['workerId'],
        message: 'Выберите работника',
      });
    }

    if (value.workerMode === 'new') {
      if (!value.lastName) {
        ctx.addIssue({
          code: 'custom',
          path: ['lastName'],
          message: 'Введите фамилию',
        });
      }

      if (!value.firstName) {
        ctx.addIssue({
          code: 'custom',
          path: ['firstName'],
          message: 'Введите имя',
        });
      }
    }
  });

export type AddWorkFormValues = z.infer<typeof addWorkFormSchema>;
