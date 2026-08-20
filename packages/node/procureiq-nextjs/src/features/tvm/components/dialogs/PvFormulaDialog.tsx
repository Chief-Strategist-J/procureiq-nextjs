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

export function PvFormulaDialog({
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
          <DialogTitle className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <Info className="h-5 w-5" /> Present Value (PV)
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Discounted Cash Flow Sum Algorithm
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-slate-300 text-xs pt-2 font-sans">
          <div className="font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-300 font-bold text-sm text-center shadow-inner">
            PV = PMT × [ (1 - (1 + r/m)⁻ᴺ) / (r/m) ]
          </div>
          <p className="leading-relaxed text-slate-300">
            <strong>Present Value (PV)</strong> calculates the current lump-sum value of a series of future cash flows discounted back at period interest rate <em>r/m</em> over total periods <em>N</em>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
