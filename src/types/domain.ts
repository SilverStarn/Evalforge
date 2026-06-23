export type TaskStatus =
  | 'unassigned'
  | 'in_progress'
  | 'submitted'
  | 'needs_review'
  | 'approved'
  | 'rejected';

export type ReviewDecision = 'A' | 'B' | 'Tie';
export type ResponseSide = 'A' | 'B';
export type CriterionType = 'rating' | 'boolean' | 'single_select' | 'multi_select' | 'free_text';
export type AnnotationSeverity = 'low' | 'medium' | 'high';

export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
  type: CriterionType;
  required: boolean;
  min?: number;
  max?: number;
  options?: string[];
}

export interface Rubric {
  id: string;
  name: string;
  version: number;
  description: string;
  criteria: RubricCriterion[];
  updatedAt: string;
}

export interface EvaluationTask {
  id: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  language: 'en' | 'es' | 'ar';
  difficulty: 'low' | 'medium' | 'high';
  assignedTo?: string;
  rubricId: string;
  prompt: string;
  responseA: string;
  responseB: string;
  createdAt: string;
  dueAt: string;
  estimatedMinutes: number;
}

export interface Annotation {
  id: string;
  response: ResponseSide;
  quote: string;
  note: string;
  severity: AnnotationSeverity;
}

export type RubricScoreValue = number | boolean | string | string[];

export interface ReviewSubmission {
  id: string;
  taskId: string;
  reviewerId: string;
  reviewerName: string;
  decision: ReviewDecision;
  confidence: number;
  scores: Record<string, RubricScoreValue>;
  annotations: Annotation[];
  minutesSpent: number;
  submittedAt: string;
  status: 'submitted' | 'approved' | 'rejected';
}

export interface LeadDecision {
  id: string;
  taskId: string;
  leadName: string;
  decision: ReviewDecision;
  note: string;
  createdAt: string;
}
