"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { transformList } from "@/core/data-driven/list-transform";
import { normalizeSearchText } from "./field-renderers/field-value-transformer";
import { resolveOptionClasses, resolveDropdownContainerClasses } from "./SearchableSelect.styles";

export interface SearchableSelectOption {
  label: string;
  value: any;
}

export function SearchableSelect({
  label,
  value,
  options = [],
  onChange,
  placeholder = "Search options...",
}: {
  label: string;
  value: any;
  options: SearchableSelectOption[];
  onChange: (val: any) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const normalizedQuery = normalizeSearchText(search);
    if (!normalizedQuery) return options;

    return transformList(
      options.map((opt) => ({ ...opt, normLabel: normalizeSearchText(opt.label) })),
      [{ op: "search", fields: ["normLabel"], query: normalizedQuery }]
    );
  }, [options, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative font-sans" ref={containerRef}>
      <label className="text-xs font-semibold text-slate-300 px-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-inner hover:border-slate-700 transition-colors"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : `Select ${label}...`}</span>
        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className={resolveDropdownContainerClasses()}>
          <div className="flex items-center px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">
            <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto space-y-1.5 px-1 py-1">
            {filteredOptions.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No options found</p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={resolveOptionClasses(isSelected)}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-indigo-400 shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
