import { z } from 'zod';
import { rubricSchema } from '@/lib/rubrics/rubricSchema';

export const taskStatusSchema = z.enum([
  'unassigned',
  'in_progress',
  'submitted',
  'needs_review',
  'approved',
  'rejected',
]);

export const reviewDecisionSchema = z.enum(['A', 'B', 'Tie']);
export const responseSideSchema = z.enum(['A', 'B']);
export const annotationSeveritySchema = z.enum(['low', 'medium', 'high']);
export const rubricScoreValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.string(),
  z.array(z.string()),
]);

export const evaluationTaskSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  projectName: z.string().min(1),
  status: taskStatusSchema,
  language: z.enum(['en', 'es', 'ar']),
  difficulty: z.enum(['low', 'medium', 'high']),
  assignedTo: z.string().min(1).optional(),
  rubricId: z.string().min(1),
  prompt: z.string().min(1),
  responseA: z.string().min(1),
  responseB: z.string().min(1),
  createdAt: z.string().datetime(),
  dueAt: z.string().datetime(),
  estimatedMinutes: z.number().int().positive(),
});

export const annotationSchema = z.object({
  id: z.string().min(1),
  response: responseSideSchema,
  quote: z.string().min(1),
  note: z.string().min(1),
  severity: annotationSeveritySchema,
});

export const reviewSubmissionSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  reviewerId: z.string().min(1),
  reviewerName: z.string().min(1),
  decision: reviewDecisionSchema,
  confidence: z.number().min(0).max(100),
  scores: z.record(rubricScoreValueSchema),
  annotations: z.array(annotationSchema),
  minutesSpent: z.number().int().positive(),
  submittedAt: z.string().datetime(),
  status: z.enum(['submitted', 'approved', 'rejected']),
});

export const leadDecisionSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  leadName: z.string().min(1),
  decision: reviewDecisionSchema,
  note: z.string().min(1),
  createdAt: z.string().datetime(),
});

export const mockDataSchema = z.object({
  tasks: z.array(evaluationTaskSchema),
  rubrics: z.array(rubricSchema),
  submissions: z.array(reviewSubmissionSchema),
  leadDecisions: z.array(leadDecisionSchema),
});
