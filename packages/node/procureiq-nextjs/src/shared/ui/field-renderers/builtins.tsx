import React from "react";
import { fieldRendererRegistry } from "./registry";
import { parseFieldValue } from "./field-value-transformer";
import { SearchableSelect } from "../SearchableSelect";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

fieldRendererRegistry.register("text", ({ field, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-300">{field.label}</label>
    <Input
      type="text"
      placeholder={field.label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
    />
  </div>
));

fieldRendererRegistry.register("number", ({ field, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-300">{field.label}</label>
    <Input
      type="number"
      placeholder={field.label}
      value={value ?? ""}
      onChange={(e) => onChange(parseFieldValue(e.target.value))}
      required={field.required}
    />
  </div>
));

fieldRendererRegistry.register("boolean", ({ field, value, onChange }) => (
  <div className="flex items-center space-x-2 py-2">
    <Checkbox
      id={field.key}
      checked={!!value}
      onCheckedChange={(checked) => onChange(!!checked)}
    />
    <label htmlFor={field.key} className="text-xs font-medium text-slate-300 cursor-pointer select-none">
      {field.label}
    </label>
  </div>
));

fieldRendererRegistry.register("select", ({ field, value, onChange }) => (
  <SearchableSelect
    label={field.label}
    value={value}
    options={field.options || []}
    onChange={(val) => onChange(val)}
  />
));

fieldRendererRegistry.register("date", ({ field, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-300">{field.label}</label>
    <Input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
    />
  </div>
));
