import { leadDecisions, rubrics, submissions, tasks } from '@/data/seed';
import { mockDataSchema } from './domainSchemas';
import type {
  EvaluationTask,
  LeadDecision,
  ReviewSubmission,
  Rubric,
  TaskStatus,
} from '@/types/domain';

const seedData = mockDataSchema.parse({
  tasks,
  rubrics,
  submissions,
  leadDecisions,
});

const taskStore: EvaluationTask[] = structuredClone(seedData.tasks);
const submissionStore: ReviewSubmission[] = structuredClone(seedData.submissions);
const rubricStore: Rubric[] = structuredClone(seedData.rubrics);
const leadDecisionStore: LeadDecision[] = structuredClone(seedData.leadDecisions);

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(value)), ms));
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  projectId?: string;
  query?: string;
}

function matchesTaskFilters(task: EvaluationTask, filters?: TaskFilters) {
  const statusMatches =
    !filters?.status || filters.status === 'all' || task.status === filters.status;
  const projectMatches = !filters?.projectId || task.projectId === filters.projectId;
  const query = filters?.query?.trim().toLowerCase();
  const queryMatches =
    !query ||
    task.prompt.toLowerCase().includes(query) ||
    task.projectName.toLowerCase().includes(query) ||
    task.id.toLowerCase().includes(query);

  return statusMatches && projectMatches && queryMatches;
}

export const mockApi = {
  async getTasks(filters?: TaskFilters) {
    return delay(taskStore.filter((task) => matchesTaskFilters(task, filters)));
  },

  async getTask(taskId: string) {
    const task = taskStore.find((item) => item.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} was not found.`);
    }
    return delay(task);
  },

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const task = taskStore.find((item) => item.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} was not found.`);
    }
    task.status = status;
    return delay(task, 150);
  },

  async getRubrics() {
    return delay(rubricStore);
  },

  async getRubric(rubricId: string) {
    const rubric = rubricStore.find((item) => item.id === rubricId);
    if (!rubric) {
      throw new Error(`Rubric ${rubricId} was not found.`);
    }
    return delay(rubric);
  },

  async saveRubric(rubric: Rubric) {
    const index = rubricStore.findIndex((item) => item.id === rubric.id);
    if (index >= 0) {
      rubricStore[index] = rubric;
    } else {
      rubricStore.push(rubric);
    }
    return delay(rubric, 200);
  },

  async getSubmissions() {
    return delay(submissionStore);
  },

  async getTaskSubmissions(taskId: string) {
    return delay(submissionStore.filter((submission) => submission.taskId === taskId));
  },

  async submitReview(submission: ReviewSubmission) {
    submissionStore.push(submission);
    const task = taskStore.find((item) => item.id === submission.taskId);
    if (task) {
      task.status = 'submitted';
    }
    return delay(submission, 300);
  },

  async getLeadDecisions() {
    return delay(leadDecisionStore);
  },

  async saveLeadDecision(decision: LeadDecision) {
    leadDecisionStore.push(decision);
    const task = taskStore.find((item) => item.id === decision.taskId);
    if (task) {
      task.status = 'approved';
    }
    return delay(decision, 250);
  },
};
