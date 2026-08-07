import React, { useState } from "react";
import { FieldRenderer } from "./field-renderers/registry";
import "./field-renderers/builtins"; // Initialize registry builtins
import type { EntitySchema } from "@/core/data-driven/entity-schema.types";

export function DataForm<T extends Record<string, unknown>>({
  schema,
  initial,
  onSubmit,
}: {
  schema: EntitySchema<T>;
  initial?: Partial<T>;
  onSubmit: (values: Partial<T>) => void;
}) {
  const [values, setValues] = useState<Partial<T>>(initial ?? {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {schema.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
        />
      ))}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
      >
        Save
      </button>
    </form>
  );
}
