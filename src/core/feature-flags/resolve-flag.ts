import { resolveRules } from "../rules-engine/evaluate";
import { Rule } from "../rules-engine/rule.types";

export async function resolveFlag(
  flagName: string,
  rules: Rule[],
  ctx: any
): Promise<boolean> {
  const relevantRules = rules.filter(r => r.category === "flag" && r.name === flagName);
  const resolved = await resolveRules(relevantRules, ctx);
  if (resolved.length === 0) return false;
  return resolved[0].effect.type === "allow";
}
