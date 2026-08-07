import React from "react";
import { fieldRendererRegistry } from "./registry";
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
      onChange={(e) => onChange(e.target.value !== "" ? Number(e.target.value) : undefined)}
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
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-300">{field.label}</label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
      required={field.required}
    >
      <option value="">Select {field.label}...</option>
      {field.options?.map((opt: any) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
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
