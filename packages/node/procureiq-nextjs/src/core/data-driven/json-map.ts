import { JsonMapOp } from "./transform.types";

export function mapJson<T extends object = Record<string, unknown>>(obj: T, ops: JsonMapOp[]): Record<string, unknown> {
  let result: Record<string, any> = { ...obj };
  for (const op of ops) {
    if (op.op === "rename") {
      if (op.from in result) {
        result[op.to] = result[op.from];
        delete result[op.from];
      }
    } else if (op.op === "pick") {
      const picked: Record<string, any> = {};
      for (const field of op.fields) {
        if (field in result) picked[field] = result[field];
      }
      result = picked;
    } else if (op.op === "omit") {
      for (const field of op.fields) {
        delete result[field];
      }
    } else if (op.op === "default") {
      if (!(op.field in result) || result[op.field] === undefined || result[op.field] === null) {
        result[op.field] = op.value;
      }
    } else if (op.op === "coerce") {
      if (op.field in result) {
        const val = result[op.field];
        if (op.to === "string") {
          result[op.field] = String(val);
        } else if (op.to === "number") {
          result[op.field] = Number(val);
        } else if (op.to === "boolean") {
          result[op.field] = Boolean(val);
        } else if (op.to === "date") {
          result[op.field] = new Date(val).toISOString();
        }
      }
    }
  }
  return result;
}
