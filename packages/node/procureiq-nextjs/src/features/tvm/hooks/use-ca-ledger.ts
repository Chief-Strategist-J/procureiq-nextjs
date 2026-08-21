/**
 * useCaLedger — CA Ledger hook: save, fetch, update notes, export CSV.
 *
 * ALGORITHM:
 *   1. On mount, fetch paginated records from Spring Boot GET /api/v1/tvm/ledger.
 *   2. saveLedgerRecord: POST /api/v1/tvm/ledger with the forecast result payload.
 *   3. updateNotes: PATCH /api/v1/tvm/ledger/{id}/notes — inline edit from UI.
 *   4. exportCsv: client-side CSV generation from in-memory records array
 *      (no image URLs stored — only numeric data and metadata).
 *
 * NO images are persisted anywhere. Charts are generated on-demand by Python
 * and rendered in-memory. The DB only stores numeric values + text notes.
 *
 * LOOP-001: Array.map used for CSV row generation.
 * UI-FETCH-001: All fetch calls are in this hook, NOT in components.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api-endpoints";
import type { LedgerRecord } from "../components/CaLedgerPanel";
import type { TimesfmForecastData, TvmParams } from "../store/tvm-slice";

// ── CSV column definitions (data-driven) ─────────────────────────────────────
// Adding a new CSV column = add one entry here. No other changes needed.
const CSV_COLUMNS: Array<{ header: string; value: (r: LedgerRecord) => string }> = [
  { header: "ID",               value: (r) => r.id },
  { header: "Date",             value: (r) => new Date(r.createdAt).toISOString() },
  { header: "Type",             value: (r) => r.calculationType },
  { header: "Rate (%)",         value: (r) => (r.statedRate * 100).toFixed(4) },
  { header: "Compounding (m)",  value: (r) => String(r.compoundingFrequency) },
  { header: "Years",            value: (r) => String(r.years) },
  { header: "PV",               value: (r) => r.presentValue.toFixed(6) },
  { header: "FV",               value: (r) => r.futureValue.toFixed(6) },
  { header: "PMT",              value: (r) => r.pmtAmount.toFixed(6) },
  { header: "Currency",         value: (r) => r.currencySymbol },
  { header: "Actor",            value: (r) => r.actorRole },
  { header: "Exported",         value: (r) => r.exportedAt ?? "" },
  { header: "Notes",            value: (r) => `"${(r.notes ?? "").replace(/"/g, '""')}"` },
];

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useCaLedger(tenantId = "default-tenant") {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Fetch ledger records from Spring Boot
  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.TVM.BASE}/ledger?page=0&size=50`,
        { headers: { "X-Tenant-Id": tenantId } }
      );
      if (!res.ok) throw new Error(`Ledger fetch failed: ${res.status}`);
      const json = await res.json();
      // Spring Boot returns ApiPagedResponse: { data: LedgerRecord[], totalElements, ... }
      setRecords(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ledger");
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Step 2: Save a new calculation record (called after every forecast run)
  const saveLedgerRecord = useCallback(
    async (forecastData: TimesfmForecastData, params: TvmParams): Promise<void> => {
      try {
        await fetch(`${API_BASE_URL}${API_ENDPOINTS.TVM.BASE}/ledger`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Tenant-Id": tenantId,
            "X-User-Role": "accountant",
          },
          body: JSON.stringify({
            eventId: forecastData.eventId,
            calculationType: params.calculationType,
            statedRate: params.statedRate,
            compoundingFrequency: params.frequency,
            effectiveAnnualRate: forecastData.effectiveAnnualRate,
            presentValue: forecastData.presentValue,
            futureValue: forecastData.futureValue,
            pmtAmount: params.pmt,
            years: params.years,
            currencySymbol: params.currencySymbol ?? "$",
            forecastJson: JSON.stringify({
              forecastPoint: forecastData.forecastPoint,
              quantile10: forecastData.quantile10,
              quantile90: forecastData.quantile90,
            }),
            modelName: forecastData.modelName,
            horizon: forecastData.horizon,
          }),
        });
        // Refresh the list after saving
        await fetchRecords();
      } catch (err) {
        console.error("Failed to save ledger record:", err);
      }
    },
    [tenantId, fetchRecords]
  );

  // Step 3: Inline notes update
  const updateNotes = useCallback(
    async (id: string, notes: string): Promise<void> => {
      try {
        const res = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.TVM.BASE}/ledger/${id}/notes`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "X-Tenant-Id": tenantId,
            },
            body: JSON.stringify({ notes }),
          }
        );
        if (res.ok) {
          // Optimistic local update — avoids a full refetch
          setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, notes } : r))
          );
        }
      } catch (err) {
        console.error("Failed to update notes:", err);
      }
    },
    [tenantId]
  );

  // Step 4: Client-side CSV export — numeric data only, no images
  const exportCsv = useCallback(() => {
    const header = CSV_COLUMNS.map((c) => c.header).join(",");
    const rows = records.map((r) =>
      CSV_COLUMNS.map((c) => c.value(r)).join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ca-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [records]);

  return { records, isLoading, error, saveLedgerRecord, updateNotes, exportCsv, fetchRecords };
}
