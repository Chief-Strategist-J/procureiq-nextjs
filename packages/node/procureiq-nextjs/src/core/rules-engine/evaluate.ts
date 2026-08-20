import { Rule, RuleCondition } from "./rule.types";
import { asyncCheckers } from "./async-checkers";
import { TelemetryService } from "@/lib/telemetry";

async function evaluateCondition(condition: RuleCondition, ctx: any): Promise<boolean> {
  const ctxVal = ctx[condition.field];

  if (condition.op === "async") {
    if (!condition.asyncCheck) return false;
    const checker = asyncCheckers.get(condition.asyncCheck);
    if (!checker) {
      console.warn(`Async checker ${condition.asyncCheck} not found`);
      return false;
    }
    return await checker(ctx, condition.value);
  }

  switch (condition.op) {
    case "eq":
      return ctxVal === condition.value;
    case "neq":
      return ctxVal !== condition.value;
    case "gt":
      return ctxVal > condition.value;
    case "gte":
      return ctxVal >= condition.value;
    case "lt":
      return ctxVal < condition.value;
    case "lte":
      return ctxVal <= condition.value;
    case "contains":
      return typeof ctxVal === "string" && ctxVal.includes(condition.value);
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(ctxVal);
    default:
      return false;
  }
}

export async function resolveRules(rules: Rule[], ctx: any): Promise<Rule[]> {
  const span = TelemetryService.createSpan("rules-engine:resolveRules");
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);
  const matchedRules: Rule[] = [];

  for (const rule of sortedRules) {
    let matches = true;
    for (const cond of rule.conditions) {
      const ok = await evaluateCondition(cond, ctx);
      if (!ok) {
        matches = false;
        break;
      }
    }
    if (matches) {
      matchedRules.push(rule);
    }
  }

  const hasDeny = matchedRules.some(r => r.effect.type === "deny");
  if (hasDeny) {
    return matchedRules.sort((a, b) => {
      if (a.effect.type === "deny" && b.effect.type !== "deny") return -1;
      if (a.effect.type !== "deny" && b.effect.type === "deny") return 1;
      return b.priority - a.priority;
    });
  }

  return matchedRules;
}
