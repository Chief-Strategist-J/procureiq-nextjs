import { describe, it, expect } from "vitest";
import { Rule } from "../rule.types";
import { resolveRules } from "../evaluate";
import { composeRuleSets } from "../compose-rules";
import { resolveFlag } from "../../feature-flags/resolve-flag";

describe("Rules Engine", () => {
  const rules: Rule[] = [
    {
      id: "rule1",
      name: "allow-admins",
      category: "flag",
      priority: 10,
      conditions: [{ field: "role", op: "eq", value: "admin" }],
      effect: { type: "allow" },
    },
    {
      id: "rule2",
      name: "allow-admins",
      category: "flag",
      priority: 20,
      conditions: [{ field: "isBanned", op: "eq", value: true }],
      effect: { type: "deny" },
    },
  ];

  it("should evaluate rules based on priority and deny-override", async () => {
    const ctxAdmin = { role: "admin", isBanned: false };
    const matchedAdmin = await resolveRules(rules, ctxAdmin);
    expect(matchedAdmin).toHaveLength(1);
    expect(matchedAdmin[0].effect.type).toBe("allow");

    const ctxBannedAdmin = { role: "admin", isBanned: true };
    const matchedBanned = await resolveRules(rules, ctxBannedAdmin);
    expect(matchedBanned).toHaveLength(2);
    // Deny-override will sort deny rules to the top of matched rules
    expect(matchedBanned[0].effect.type).toBe("deny");
  });

  it("should compose rule sets", () => {
    const setA: Rule[] = [rules[0]];
    const setB: Rule[] = [rules[1]];
    const composed = composeRuleSets(setA, setB);
    expect(composed).toHaveLength(2);
  });

  it("should resolve feature flags utilizing rules", async () => {
    const ctxAllowed = { role: "admin", isBanned: false };
    const ok = await resolveFlag("allow-admins", rules, ctxAllowed);
    expect(ok).toBe(true);

    const ctxDenied = { role: "admin", isBanned: true };
    const fail = await resolveFlag("allow-admins", rules, ctxDenied);
    expect(fail).toBe(false);
  });
});
