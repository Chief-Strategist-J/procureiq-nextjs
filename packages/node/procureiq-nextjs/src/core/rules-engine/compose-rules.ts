import { Rule } from "./rule.types";

export function composeRuleSets(...ruleSets: Rule[][]): Rule[] {
  const composed: Rule[] = [];
  const ids = new Set<string>();

  for (const set of ruleSets) {
    for (const rule of set) {
      if (!ids.has(rule.id)) {
        composed.push(rule);
        ids.add(rule.id);
      }
    }
  }
  return composed;
}
