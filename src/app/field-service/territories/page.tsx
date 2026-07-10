"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Plus, RefreshCw, CheckCircle2, AlertCircle, X, Edit2, Trash2, Clock } from "lucide-react";
import { FieldServiceApi } from "../api-client";
import { ServiceTerritory, OperatingHours } from "../types";

export default function TerritoriesPage() {
  const router = useRouter();
  const [items, setItems] = useState<ServiceTerritory[]>([]);
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [operatingHoursId, setOperatingHoursId] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const territoryList = await FieldServiceApi.listTerritories();
      const ohList = await FieldServiceApi.listOperatingHours();
      setItems(territoryList);
      setOperatingHours(ohList);
      if (ohList.length > 0) {
        setOperatingHoursId(ohList[0].id);
      }
    } catch (err: any) {
      setError("Failed to load service territories data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreateModal = () => {
    setModalMode("create");
    setName("");
    if (operatingHours.length > 0) {
      setOperatingHoursId(operatingHours[0].id);
    }
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ServiceTerritory) => {
    setModalMode("edit");
    setEditingId(item.id);
    setName(item.name);
    setOperatingHoursId(item.operatingHoursId);
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (modalMode === "create") {
        await FieldServiceApi.createTerritory({ name, operatingHoursId, isActive });
        setSuccess("Service territory created successfully.");
      } else if (modalMode === "edit" && editingId !== null) {
        await FieldServiceApi.updateTerritory(editingId, { name, operatingHoursId, isActive });
        setSuccess("Service territory updated successfully.");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || "Failed to save territory details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service territory?")) return;
    setError("");
    setSuccess("");
    try {
      await FieldServiceApi.deleteTerritory(id);
      setSuccess("Service territory deleted successfully.");
      fetchItems();
    } catch (err: any) {
      setError("Failed to delete territory.");
    }
  };

  const getOperatingHoursName = (ohId: number) => {
    const found = operatingHours.find((oh) => oh.id === ohId);
    return found ? found.name : `Hours #${ohId}`;
  };

  const filteredItems = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      getOperatingHoursName(item.operatingHoursId).toLowerCase().includes(q) ||
      item.id.toString().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      {/* Glow effects */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
        <span className="hover:text-zinc-300 cursor-pointer" onClick={() => router.push("/field-service")}>Field Service</span>
        <span>/</span>
        <span className="text-zinc-300">Territories</span>
      </div>

      {/* Header bar */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-md">
              <MapPin className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Service Territories
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Configure operational regional boundaries and assign active operating hours calendar slots.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            <Plus className="h-4 w-4" />
            Create Territory
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {error && (
        <div className="mb-6 p-3.5 text-xs bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 p-3.5 text-xs bg-emerald-950/20 border border-emerald-555/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, operating hours or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-600 mb-3" />
              <p className="text-xs tracking-wider">Syncing service territories...</p>
            </div>
          ) : (
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead>
                <tr className="bg-zinc-950/80 text-left text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <th className="px-5 py-4 font-medium w-24">Territory ID</th>
                  <th className="px-5 py-4 font-medium w-72">Name</th>
                  <th className="px-5 py-4 font-medium w-72">Operating Hours</th>
                  <th className="px-5 py-4 font-medium w-36">Status</th>
                  <th className="px-5 py-4 font-medium text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-900/20 transition-all duration-300 border-b border-zinc-900 text-zinc-300"
                  >
                    <td className="px-5 py-4 text-xs font-mono font-semibold text-white">
                      #{item.id}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-zinc-200">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-zinc-500" />
                        {getOperatingHoursName(item.operatingHoursId)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
                        item.isActive 
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:text-white transition-all text-zinc-400 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/20 bg-zinc-950/60 hover:text-red-400 transition-all text-zinc-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-zinc-500 text-xs">
                      No service territory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/90 text-white animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-light tracking-tight mb-5 flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-emerald-400" />
              {modalMode === "create" ? "Create Service Territory" : "Edit Service Territory"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Territory Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pacific Northwest Sector"
                  required
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Operating Hours Schedule</label>
                <select
                  value={operatingHoursId}
                  onChange={(e) => setOperatingHoursId(Number(e.target.value))}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                >
                  {operatingHours.map((oh) => (
                    <option key={oh.id} value={oh.id}>
                      {oh.name} ({oh.timezone})
                    </option>
                  ))}
                  {operatingHours.length === 0 && (
                    <option value={1}>HQ East Coast Standard Shift (Default)</option>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs text-zinc-300 select-none cursor-pointer">
                  Territory is Active & Available for dispatching
                </label>
              </div>

              <div className="flex justify-end gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all duration-300"
                >
                  {saving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
