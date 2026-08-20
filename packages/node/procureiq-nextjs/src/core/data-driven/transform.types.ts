export type JsonMapOp =
  | { op: "rename"; from: string; to: string }
  | { op: "pick"; fields: string[] }
  | { op: "omit"; fields: string[] }
  | { op: "default"; field: string; value: unknown }
  | { op: "coerce"; field: string; to: "string" | "number" | "boolean" | "date" };

export type ListOp =
  | { op: "search"; fields: string[]; query: string }
  | { op: "filter"; field: string; value: unknown }
  | { op: "sort"; field: string; direction: "asc" | "desc" }
  | { op: "paginate"; page: number; limit: number }
  | { op: "pick"; fields: string[] };
