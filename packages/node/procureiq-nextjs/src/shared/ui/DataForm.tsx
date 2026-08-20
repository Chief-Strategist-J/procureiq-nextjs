import React, { useState, useEffect } from "react";
import { FieldRenderer } from "./field-renderers/registry";
import "./field-renderers/builtins";
import type { EntitySchema } from "@/core/data-driven/entity-schema.types";

export function DataForm<T extends Record<string, unknown>>({
  schema,
  initial,
  onSubmit,
  onChange,
  submitLabel = "Save",
}: {
  schema: EntitySchema<T>;
  initial?: Partial<T>;
  onSubmit?: (values: Partial<T>) => void;
  onChange?: (values: Partial<T>) => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Partial<T>>(initial ?? {});

  useEffect(() => {
    if (initial) {
      setValues(initial);
    }
  }, [initial]);

  const handleChange = (key: string, v: unknown) => {
    const updated = { ...values, [key]: v };
    setValues(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {schema.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(v) => handleChange(field.key, v)}
        />
      ))}
      {onSubmit && (
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
}
