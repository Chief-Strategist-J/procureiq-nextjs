import { WorkflowStep, WorkflowContext } from "./step.types";

export type StepExecutor = (step: WorkflowStep, ctx: WorkflowContext) => Promise<void>;

const registry = new Map<string, StepExecutor>();

export const stepRegistry = {
  register(type: string, executor: StepExecutor) {
    registry.set(type, executor);
  },
  get(type: string): StepExecutor | undefined {
    return registry.get(type);
  },
};
