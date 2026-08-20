export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config: any;
}

export interface WorkflowContext {
  state: Record<string, any>;
  variables: Record<string, any>;
}
