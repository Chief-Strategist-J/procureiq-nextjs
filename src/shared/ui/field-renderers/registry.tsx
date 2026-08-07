import React from "react";
import { FieldConfig } from "@/core/data-driven/entity-schema.types";

export type FieldRendererComponent = (props: {
  field: FieldConfig<any>;
  value: any;
  onChange: (value: any) => void;
}) => React.ReactElement;

const registry = new Map<string, FieldRendererComponent>();

export const fieldRendererRegistry = {
  register(kind: string, component: FieldRendererComponent) {
    registry.set(kind, component);
  },
  get(kind: string): FieldRendererComponent | undefined {
    return registry.get(kind);
  },
};

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldConfig<any>;
  value: any;
  onChange: (value: any) => void;
}) {
  const Renderer = fieldRendererRegistry.get(field.kind);
  if (!Renderer) {
    return <div>Unsupported field kind: {field.kind}</div>;
  }
  return <Renderer field={field} value={value} onChange={onChange} />;
}
