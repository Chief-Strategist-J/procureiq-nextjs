import { WorkflowStep, WorkflowContext } from "./step.types";
import { stepRegistry } from "./step-registry";
import { TelemetryService } from "@/lib/telemetry";

export async function runWorkflow(
  steps: WorkflowStep[],
  initialContext: WorkflowContext
): Promise<WorkflowContext> {
  const rootSpan = TelemetryService.createSpan("workflow:run");
  const ctx = { ...initialContext };

  for (const step of steps) {
    const stepSpan = TelemetryService.createSpan(`workflow:step:${step.name}`);
    const executor = stepRegistry.get(step.type);
    if (!executor) {
      throw new Error(`No executor registered for step type: ${step.type}`);
    }
    try {
      await executor(step, ctx);
    } catch (err) {
      console.error(`Error in step ${step.name} (Trace: ${stepSpan.traceId}):`, err);
      throw err;
    }
  }

  return ctx;
}
