import { ListOp } from "./transform.types";

export function transformList<T extends Record<string, any>>(list: T[], ops: ListOp[]): T[] {
  let result = [...list];
  for (const op of ops) {
    if (op.op === "search") {
      const q = op.query.toLowerCase().trim();
      if (q) {
        result = result.filter((item) =>
          op.fields.some((field) => String(item[field] ?? "").toLowerCase().includes(q))
        );
      }
    } else if (op.op === "filter") {
      result = result.filter((item) => item[op.field] === op.value);
    } else if (op.op === "sort") {
      const dir = op.direction === "desc" ? -1 : 1;
      result = result.sort((a, b) => {
        const valA = a[op.field];
        const valB = b[op.field];
        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        return valA < valB ? -dir : dir;
      });
    } else if (op.op === "paginate") {
      const start = (op.page - 1) * op.limit;
      result = result.slice(start, start + op.limit);
    } else if (op.op === "pick") {
      result = result.map((item) => {
        const picked: any = {};
        for (const field of op.fields) {
          picked[field] = item[field];
        }
        return picked;
      });
    }
  }
  return result;
}
