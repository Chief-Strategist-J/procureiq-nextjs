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

export function HorizonFormulaDialog({
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
          <DialogTitle className="flex items-center gap-2 text-purple-400 font-bold text-lg">
            <Info className="h-5 w-5" /> Compounding Periods (N)
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Discrete Period Calculation Algorithm
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-slate-300 text-xs pt-2 font-sans">
          <div className="font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-purple-300 font-bold text-sm text-center shadow-inner">
            N = Investment Years × Compounding Frequency (m)
          </div>
          <p className="leading-relaxed text-slate-300">
            <strong>Total Compounding Periods (N)</strong> represents the total discrete periods over which cash flows are discounted or compounded.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
