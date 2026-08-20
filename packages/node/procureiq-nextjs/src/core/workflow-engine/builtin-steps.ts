import { stepRegistry } from "./step-registry";
import { resolveRules } from "../rules-engine/evaluate";

stepRegistry.register("evaluateRules", async (step, ctx) => {
  const { rules, inputField, outputField } = step.config;
  const inputVal = ctx.state[inputField] || ctx.variables[inputField];
  const matched = await resolveRules(rules, inputVal);
  ctx.state[outputField] = matched;
});

stepRegistry.register("log", async (step, ctx) => {
  console.log(`[WORKFLOW LOG] ${step.config.message}`, ctx);
});
