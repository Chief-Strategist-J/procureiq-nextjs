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

export function FvFormulaDialog({
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
          <DialogTitle className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
            <Info className="h-5 w-5" /> Future Value (FV)
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Exponential Compounding Growth Algorithm
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-slate-300 text-xs pt-2 font-sans">
          <div className="font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-cyan-300 font-bold text-sm text-center shadow-inner">
            FV_N = PV × (1 + r_s / m)ᵐᴺ
          </div>
          <p className="leading-relaxed text-slate-300">
            <strong>Non-Annual Compounding Future Value (FV_N)</strong> calculates total growth where <em>r_s</em> is the stated annual interest rate, <em>m</em> is compounding frequency per year, and <em>N</em> is years (giving <em>mN</em> total compounding periods).
          </p>
          <div className="rounded-lg bg-slate-950 p-3 border border-cyan-500/20 text-[11px] space-y-2 text-slate-400">
            <p className="text-cyan-400 font-semibold">CFA Quantitative Time Value Principles:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              <li>Money amounts can only be added directly when indexed at the exact same point in time.</li>
              <li>For a given interest rate <em>r</em>, Future Value increases monotonically with compounding periods <em>N</em>.</li>
              <li>For a given number of periods <em>N</em>, Future Value increases monotonically with interest rate <em>r</em>.</li>
            </ul>
            <div className="pt-2 border-t border-slate-800 text-slate-300 space-y-1">
              <p className="font-semibold text-cyan-300">CFA Example Calculations:</p>
              <p>• <strong>Example 1 (Annual 5 yrs):</strong> $5M at 7% = $5M × (1.07)⁵ = $7,012,758.65</p>
              <p>• <strong>Example 2 (Annual 6 yrs):</strong> ¥2.5M at 8% = ¥2.5M × (1.08)⁶ = ¥3,967,186.00</p>
              <p>• <strong>Example 3 (Deferred 10 yrs):</strong> $10M at 9% = $10M × (1.09)¹⁰ = $23,673,636.75</p>
              <p>• <strong>Example 4 (Quarterly Compounding m=4):</strong> $10,000 at 8% for 2 yrs = $10,000 × (1.02)⁸ = $11,716.59</p>
              <p>• <strong>Example 5 (Monthly Compounding m=12):</strong> A$1M at 6% for 1 yr = A$1M × (1.005)¹² = A$1,061,677.81</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
