import { z } from 'zod';

export const criterionSchema = z
  .object({
    id: z.string().min(2),
    label: z.string().min(2),
    description: z.string().min(2),
    type: z.enum(['rating', 'boolean', 'single_select', 'multi_select', 'free_text']),
    required: z.boolean(),
    min: z.number().int().optional(),
    max: z.number().int().optional(),
    options: z.array(z.string().min(1)).optional(),
  })
  .superRefine((criterion, context) => {
    if (criterion.type === 'rating') {
      if (criterion.min === undefined || criterion.max === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Rating criteria require min and max values.',
          path: ['min'],
        });
      }
      if (
        criterion.min !== undefined &&
        criterion.max !== undefined &&
        criterion.min >= criterion.max
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Rating min must be lower than max.',
          path: ['max'],
        });
      }
    }

    if (['single_select', 'multi_select'].includes(criterion.type)) {
      if (!criterion.options || criterion.options.length < 2) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Select criteria require at least two options.',
          path: ['options'],
        });
      }
    }
  });

export const rubricSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(3),
  version: z.number().int().positive(),
  description: z.string().min(10),
  criteria: z.array(criterionSchema).min(1),
  updatedAt: z.string().datetime(),
});

export type RubricSchema = z.infer<typeof rubricSchema>;
