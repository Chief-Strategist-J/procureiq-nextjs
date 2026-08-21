import React, { useMemo, useState } from "react";
import { transformList } from "@/core/data-driven/list-transform";
import type { EntitySchema } from "@/core/data-driven/entity-schema.types";
import type { ListOp } from "@/core/data-driven/transform.types";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<T extends Record<string, unknown>> {
  schema: EntitySchema<T>;
  rows: T[];
  extraOps?: ListOp[];
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  schema,
  rows,
  extraOps = [],
  isLoading = false,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const ops: ListOp[] = query
      ? [{ op: "search", fields: schema.fields.map((f) => f.key), query }, ...extraOps]
      : extraOps;
    return transformList(rows, ops);
  }, [rows, query, extraOps, schema.fields]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-xs"
        disabled={isLoading}
      />
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur-md">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs font-semibold uppercase text-slate-400">
            <tr>
              {schema.fields.map((f) => (
                <th key={f.key} className="px-6 py-3">
                  {f.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {schema.fields.map((f) => (
                    <td key={f.key} className="px-6 py-4">
                      <Skeleton className="h-4 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={schema.fields.length} className="px-6 py-10 text-center text-slate-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              visible.map((row: any, i) => (
                <tr key={row.id ?? i} className="hover:bg-slate-850/50 transition-colors">
                  {schema.fields.map((f) => (
                    <td key={f.key} className="px-6 py-4 font-medium whitespace-nowrap">
                      {String(row[f.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
