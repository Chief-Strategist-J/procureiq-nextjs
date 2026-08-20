import { resolveRules } from "../rules-engine/evaluate";
import { Rule } from "../rules-engine/rule.types";

export interface UserContext {
  id: string;
  role: string;
  permissions?: string[];
}

export async function checkPermission(
  user: UserContext,
  action: string,
  resource: string,
  rules: Rule[],
  extraCtx: Record<string, any> = {}
): Promise<boolean> {
  const ctx = {
    role: user.role,
    userId: user.id,
    action,
    resource,
    ...extraCtx,
  };

  const matchedRules = await resolveRules(rules, ctx);
  if (matchedRules.length === 0) {
    return false;
  }

  return matchedRules[0].effect.type === "allow";
}
