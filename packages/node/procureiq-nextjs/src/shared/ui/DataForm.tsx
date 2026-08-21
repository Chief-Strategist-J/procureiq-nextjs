/**
 * DataForm — Schema-driven controlled form.
 *
 * ALGORITHM:
 *   1. Internal `values` state is the single source of truth during editing.
 *   2. `initial` is only synced in once — on mount — via `useState` initializer.
 *      We do NOT watch `initial` as a dep (avoids the classic
 *      "parent-updates-state → onChange → parent-updates-state → ∞" loop).
 *   3. If the parent needs to reset the form externally it must change the
 *      `key` prop on <DataForm> to force a remount — the standard React pattern
 *      for controlled-to-uncontrolled sync.
 *   4. Each field change calls `onChange(patch)` with ONLY the changed key so
 *      the parent can merge it into its own store without replacing the whole object.
 *
 * LOOP-001 compliant: uses Array.map, no for-loops.
 * UI-LOGIC-001 compliant: zero business logic — pure render + event delegation.
 * UI-FETCH-001 compliant: no fetch calls.
 */
import React, { useState } from "react";
import { FieldRenderer } from "./field-renderers/registry";
import "./field-renderers/builtins";
import type { EntitySchema } from "@/core/data-driven/entity-schema.types";
import { Button } from "@/components/ui/button";

interface DataFormProps<T extends Record<string, unknown>> {
  schema: EntitySchema<T>;
  /** Used ONLY as initial value — not a controlled prop. Change `key` to reset. */
  initial?: Partial<T>;
  onSubmit?: (values: Partial<T>) => void;
  /** Called with the FULL updated values object on every field change. */
  onChange?: (values: Partial<T>) => void;
  submitLabel?: string;
  pendingLabel?: string;
  isPending?: boolean;
}

export function DataForm<T extends Record<string, unknown>>({
  schema,
  initial,
  onSubmit,
  onChange,
  submitLabel = "Save",
  pendingLabel = "Saving...",
  isPending = false,
}: DataFormProps<T>) {
  // Step 1: Seed local state from `initial` once at mount.
  const [values, setValues] = useState<Partial<T>>(() => initial ?? {});

  // Step 2: Handle a single field change.
  const handleChange = (key: string, v: unknown) => {
    const updated = { ...values, [key]: v } as Partial<T>;
    setValues(updated);
    // Notify parent with the full merged object so it can dispatch to its store.
    onChange?.(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPending) {
      onSubmit?.(values);
    }
  };

  // Step 3: Render — schema.fields drives the field list (data-driven, no per-field JSX).
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {schema.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key as keyof T]}
          onChange={(v) => handleChange(field.key, v)}
        />
      ))}
      {onSubmit && (
        <Button
          type="submit"
          isLoading={isPending}
          pendingText={pendingLabel}
          className="w-full font-semibold shadow-md"
        >
          {submitLabel}
        </Button>
      )}
    </form>
  );
}
