export interface Workflow {
  id: number;
  orgId: number;
  name: string;
  status: string;
}

export interface WorkflowRun {
  id: number;
  workflowId: number;
  status: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}
