/**
 * Workflows API — built on the shared createResourceApi factory.
 * No repeated headers, no duplicated fetch logic.
 */
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { createResourceApi } from '@/shared/utils/resourceApi';

export interface Workflow {
  id: number;
  name: string;
  status: string;
  config: Record<string, any>;
}

export interface WorkflowRun {
  id: number;
  workflowId: number;
  status: string;
  startedAt: string;
  completedAt?: string;
}

const base = createResourceApi<Workflow>({
  endpoints: API_ENDPOINTS.workflows as any,
  storageKey: 'piq_workflows',
  label: 'workflow',
  seed: [],
});

export const WorkflowsApi = {
  listWorkflows: () => base.list(),
  createWorkflow: (data: Omit<Workflow, 'id'>) => base.create(data),
  updateWorkflow: (id: number, data: Omit<Workflow, 'id'>) => base.update(id, data),
  deleteWorkflow: (id: number) => base.remove(id),
  listRuns: (workflowId: number) =>
    base.get<WorkflowRun[]>(API_ENDPOINTS.workflows.runs(String(workflowId)), 'list workflow runs'),
  triggerRun: (workflowId: number) =>
    base.post<WorkflowRun>(API_ENDPOINTS.workflows.trigger(String(workflowId)), {}, 'trigger workflow run'),
};
