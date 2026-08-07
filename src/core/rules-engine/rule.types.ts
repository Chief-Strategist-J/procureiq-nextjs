export interface RuleCondition {
  field: string;
  op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "in" | "async";
  value: any;
  asyncCheck?: string;
}

export interface RuleEffect {
  type: "allow" | "deny" | "set" | "flag";
  target?: string;
  value?: any;
}

export interface Rule {
  id: string;
  name: string;
  category: string;
  priority: number;
  conditions: RuleCondition[];
  effect: RuleEffect;
}
