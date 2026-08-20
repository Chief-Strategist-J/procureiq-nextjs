import { describe, it, expect } from "vitest";
import { mapJson } from "../json-map";
import { transformList } from "../list-transform";

describe("JSON Map utility", () => {
  it("should rename fields", () => {
    const raw = { raw_field: "value" };
    const mapped = mapJson(raw, [{ op: "rename", from: "raw_field", to: "cleanField" }]);
    expect(mapped).toEqual({ cleanField: "value" });
  });

  it("should pick specified fields", () => {
    const raw = { a: 1, b: 2, c: 3 };
    const mapped = mapJson(raw, [{ op: "pick", fields: ["a", "c"] }]);
    expect(mapped).toEqual({ a: 1, c: 3 });
  });

  it("should omit specified fields", () => {
    const raw = { a: 1, b: 2, c: 3 };
    const mapped = mapJson(raw, [{ op: "omit", fields: ["b"] }]);
    expect(mapped).toEqual({ a: 1, c: 3 });
  });

  it("should apply default values", () => {
    const raw = { a: 1 };
    const mapped = mapJson(raw, [{ op: "default", field: "b", value: 10 }]);
    expect(mapped).toEqual({ a: 1, b: 10 });
  });

  it("should coerce field types", () => {
    const raw = { num: "42", flag: 0 };
    const mapped = mapJson(raw, [
      { op: "coerce", field: "num", to: "number" },
      { op: "coerce", field: "flag", to: "boolean" },
    ]);
    expect(mapped).toEqual({ num: 42, flag: false });
  });
});

describe("List Transform utility", () => {
  const items = [
    { id: "1", name: "Apple", category: "fruit", price: 1.5 },
    { id: "2", name: "Banana", category: "fruit", price: 0.8 },
    { id: "3", name: "Carrot", category: "vegetable", price: 1.2 },
  ];

  it("should search items matching query", () => {
    const results = transformList(items, [{ op: "search", fields: ["name"], query: "an" }]);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Banana");
  });

  it("should filter items", () => {
    const results = transformList(items, [{ op: "filter", field: "category", value: "fruit" }]);
    expect(results).toHaveLength(2);
  });

  it("should sort items", () => {
    const results = transformList(items, [{ op: "sort", field: "price", direction: "asc" }]);
    expect(results[0].price).toBe(0.8);
    expect(results[2].price).toBe(1.5);
  });

  it("should paginate items", () => {
    const results = transformList(items, [{ op: "paginate", page: 2, limit: 2 }]);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Carrot");
  });
});
