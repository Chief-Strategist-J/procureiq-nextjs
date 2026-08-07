import { describe, it, expect, vi } from "vitest";
import { checkPermission } from "../rbac";
import { auditLogger } from "../audit-logger";
import { Rule } from "../../rules-engine/rule.types";
import { eventBus } from "../../event-bus/event-bus";

describe("RBAC Permissions", () => {
  const rules: Rule[] = [
    {
      id: "perm1",
      name: "delete-post",
      category: "permission",
      priority: 100,
      conditions: [{ field: "role", op: "eq", value: "admin" }],
      effect: { type: "allow" },
    },
  ];

  it("should allow permission check when matching rule allows it", async () => {
    const user = { id: "u123", role: "admin" };
    const ok = await checkPermission(user, "delete", "post", rules);
    expect(ok).toBe(true);
  });

  it("should deny permission check when no rules match", async () => {
    const user = { id: "u123", role: "editor" };
    const ok = await checkPermission(user, "delete", "post", rules);
    expect(ok).toBe(false);
  });
});

describe("Audit Logger", () => {
  it("should log actions and emit them to the eventBus", () => {
    const callback = vi.fn();
    const unsubscribe = eventBus.on("audit.log", callback);

    auditLogger.log({
      userId: "user-999",
      action: "read",
      resource: "wallets",
      status: "success",
      details: { ip: "127.0.0.1" },
    });

    expect(callback).toHaveBeenCalledOnce();
    const entry = callback.mock.calls[0][0];
    expect(entry.userId).toBe("user-999");
    expect(entry.action).toBe("read");
    expect(entry.status).toBe("success");
    expect(entry.traceId).toBeDefined();

    unsubscribe();
  });
});
