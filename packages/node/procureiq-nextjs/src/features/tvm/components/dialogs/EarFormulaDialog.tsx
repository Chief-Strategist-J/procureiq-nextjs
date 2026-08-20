"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function EarFormulaDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
            <Info className="h-5 w-5" /> Effective Annual Rate (EAR)
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Compounded Annual Yield Algorithm
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-slate-300 text-xs pt-2 font-sans">
          <div className="font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-indigo-300 font-bold text-sm text-center shadow-inner">
            EAR = (1 + r / m)ᵐ - 1
          </div>
          <p className="leading-relaxed text-slate-300">
            <strong>Effective Annual Rate (EAR)</strong> measures the actual annual yield earned on an investment when compounding occurs more frequently than once per year (where <em>r</em> is stated annual rate and <em>m</em> is compounding frequency per year).
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
