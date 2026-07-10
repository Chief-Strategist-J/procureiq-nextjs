"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarDays, Plus, RefreshCw, CheckCircle2, AlertCircle, X, Edit2, Trash2, UserPlus, UserCheck, UserMinus, Clock } from "lucide-react";
import { FieldServiceApi } from "../api-client";
import { ServiceAppointment, ServiceResource } from "../types";

export default function AppointmentsPage() {
  const router = useRouter();
  const [items, setItems] = useState<ServiceAppointment[]>([]);
  const [resources, setResources] = useState<ServiceResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Candidate Match panel state
  const [matchingAppointment, setMatchingAppointment] = useState<ServiceAppointment | null>(null);
  const [candidates, setCandidates] = useState<ServiceResource[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // Form Fields
  const [parentId, setParentId] = useState("");
  const [parentType, setParentType] = useState<"work_order" | "work_order_line_item">("work_order");
  const [status, setStatus] = useState("new");
  const [earliestStartPermitted, setEarliestStartPermitted] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [arrivalWindowStart, setArrivalWindowStart] = useState("");
  const [arrivalWindowEnd, setArrivalWindowEnd] = useState("");
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledEnd, setScheduledEnd] = useState("");
  const [duration, setDuration] = useState("2.0");
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await FieldServiceApi.listAppointments();
      const resList = await FieldServiceApi.listResources();
      setItems(data);
      setResources(resList);
    } catch (err: any) {
      setError("Failed to load service appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreateModal = () => {
    setModalMode("create");
    setParentId("1001");
    setParentType("work_order");
    setStatus("new");
    setEarliestStartPermitted(new Date().toISOString().substring(0, 16));
    setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 16));
    setArrivalWindowStart("");
    setArrivalWindowEnd("");
    setScheduledStart("");
    setScheduledEnd("");
    setDuration("2.0");
    setIsModalOpen(true);
  };

  const openEditModal = (item: ServiceAppointment) => {
    setModalMode("edit");
    setEditingId(item.id);
    setParentId(item.parentId.toString());
    setParentType(item.parentType);
    setStatus(item.status);
    setEarliestStartPermitted(item.earliestStartPermitted ? new Date(item.earliestStartPermitted).toISOString().substring(0, 16) : "");
    setDueDate(item.dueDate ? new Date(item.dueDate).toISOString().substring(0, 16) : "");
    setArrivalWindowStart(item.arrivalWindowStart ? new Date(item.arrivalWindowStart).toISOString().substring(0, 16) : "");
    setArrivalWindowEnd(item.arrivalWindowEnd ? new Date(item.arrivalWindowEnd).toISOString().substring(0, 16) : "");
    setScheduledStart(item.scheduledStart ? new Date(item.scheduledStart).toISOString().substring(0, 16) : "");
    setScheduledEnd(item.scheduledEnd ? new Date(item.scheduledEnd).toISOString().substring(0, 16) : "");
    setDuration(item.duration ? item.duration.toString() : "2.0");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload: Omit<ServiceAppointment, "id"> = {
      parentId: Number(parentId),
      parentType,
      status,
      duration: duration ? Number(duration) : undefined,
      earliestStartPermitted: earliestStartPermitted ? new Date(earliestStartPermitted).toISOString() : undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      arrivalWindowStart: arrivalWindowStart ? new Date(arrivalWindowStart).toISOString() : undefined,
      arrivalWindowEnd: arrivalWindowEnd ? new Date(arrivalWindowEnd).toISOString() : undefined,
      scheduledStart: scheduledStart ? new Date(scheduledStart).toISOString() : undefined,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd).toISOString() : undefined,
    };

    try {
      if (modalMode === "create") {
        await FieldServiceApi.createAppointment(payload);
        setSuccess("Service appointment scheduled successfully.");
      } else if (modalMode === "edit" && editingId !== null) {
        await FieldServiceApi.updateAppointment(editingId, payload);
        setSuccess("Service appointment details updated.");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || "Failed to save appointment details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to cancel and delete this service appointment?")) return;
    setError("");
    setSuccess("");
    try {
      await FieldServiceApi.deleteAppointment(id);
      setSuccess("Appointment deleted successfully.");
      fetchItems();
    } catch (err: any) {
      setError("Failed to delete appointment.");
    }
  };

  const handleMatchCandidates = async (item: ServiceAppointment) => {
    setMatchingAppointment(item);
    setLoadingCandidates(true);
    try {
      const list = await FieldServiceApi.getCandidates(item.id);
      setCandidates(list);
    } catch (err) {
      setError("Failed to fetch candidate list.");
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleAssignResource = async (resourceId: number) => {
    if (!matchingAppointment) return;
    setError("");
    setSuccess("");
    try {
      await FieldServiceApi.assignResource(matchingAppointment.id, resourceId);
      setSuccess(`Resource assigned successfully to Appointment #${matchingAppointment.id}`);
      setMatchingAppointment(null);
      fetchItems();
    } catch (err) {
      setError("Assignment failed.");
    }
  };

  const handleUnassignResource = async (id: number) => {
    setError("");
    setSuccess("");
    try {
      await FieldServiceApi.deleteAssignment(id);
      setSuccess("Resource assignment released successfully.");
      fetchItems();
    } catch (err) {
      setError("Unassignment failed.");
    }
  };

  const getResourceName = (resId?: number) => {
    if (!resId) return null;
    const found = resources.find((r) => r.id === resId);
    return found ? found.name : `Resource #${resId}`;
  };

  const filteredItems = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.parentId.toString().includes(q) ||
      item.parentType.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.id.toString().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
        <span className="hover:text-zinc-300 cursor-pointer" onClick={() => router.push("/field-service")}>Field Service</span>
        <span>/</span>
        <span className="text-zinc-300">Appointments</span>
      </div>

      {/* Header bar */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-md">
              <CalendarDays className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Service Appointments
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Schedule execution times, query constraint-matched resource candidates, and dispatch assignments.
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
            Schedule Appointment
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
        <div className="mb-6 p-3.5 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
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
            placeholder="Search by parent ID, type or status..."
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
              <p className="text-xs tracking-wider">Syncing service appointments...</p>
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-sm text-left">
              <thead>
                <tr className="bg-zinc-950/80 text-left text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <th className="px-5 py-4 font-medium w-24">Appt ID</th>
                  <th className="px-5 py-4 font-medium w-48">Parent Entity</th>
                  <th className="px-5 py-4 font-medium w-32">Duration</th>
                  <th className="px-5 py-4 font-medium w-32">Status</th>
                  <th className="px-5 py-4 font-medium w-64">Assigned Resource</th>
                  <th className="px-5 py-4 font-medium text-right pr-6">Dispatcher Actions</th>
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
                    <td className="px-5 py-4 text-xs font-mono text-zinc-400">
                      <span className="text-[10px] uppercase font-semibold text-zinc-500 block">{item.parentType.replace("_", " ")}</span>
                      #{item.parentId}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-400">
                      {item.duration} hrs
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
                        item.status === "assigned"
                          ? "bg-blue-950/60 text-blue-400 border-blue-800/40"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {item.assignedResourceId ? (
                        <span className="flex items-center gap-1.5 text-zinc-200 font-medium">
                          <UserCheck className="h-4 w-4 text-blue-400" />
                          {getResourceName(item.assignedResourceId)}
                        </span>
                      ) : (
                        <span className="text-zinc-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2.5">
                        {item.assignedResourceId ? (
                          <button
                            onClick={() => handleUnassignResource(item.id)}
                            title="Unassign Resource"
                            className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-zinc-800 hover:border-red-950 hover:bg-red-950/20 bg-zinc-950/60 hover:text-red-400 transition-all text-xs text-zinc-400 cursor-pointer font-medium"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                            Release
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMatchCandidates(item)}
                            className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:text-white transition-all text-xs text-zinc-400 cursor-pointer font-medium"
                          >
                            <UserPlus className="h-3.5 w-3.5 text-blue-400" />
                            Match candidates
                          </button>
                        )}

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
                    <td colSpan={6} className="px-5 py-16 text-center text-zinc-500 text-xs">
                      No service appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Candidate matching / dispatcher modal */}
      {matchingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMatchingAppointment(null)} />
          
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/90 text-white animate-scaleIn">
            <button
              onClick={() => setMatchingAppointment(null)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-light tracking-tight mb-2 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-400" />
              Match Candidates & Dispatch
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Constraint-matching resources for Appointment #{matchingAppointment.id} (Parent Work Order #{matchingAppointment.parentId}).
            </p>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {loadingCandidates ? (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                  <RefreshCw className="h-6 w-6 animate-spin text-zinc-600 mb-2" />
                  <p className="text-xs">Computing scheduling constraints...</p>
                </div>
              ) : (
                candidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all"
                  >
                    <div>
                      <span className="text-xs font-semibold text-zinc-200 block">{cand.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono capitalize">{cand.resourceType}</span>
                    </div>
                    <button
                      onClick={() => handleAssignResource(cand.id)}
                      className="px-3 py-1.5 rounded bg-white text-black hover:bg-zinc-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      Assign Resource
                    </button>
                  </div>
                ))
              )}
              {candidates.length === 0 && !loadingCandidates && (
                <div className="text-center py-10 text-zinc-500 text-xs">
                  No active candidate resources met scheduling guidelines.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/95 text-white animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-light tracking-tight mb-5 flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-blue-400" />
              {modalMode === "create" ? "Schedule Service Appointment" : "Update Appointment Details"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Parent Type</label>
                  <select
                    value={parentType}
                    onChange={(e) => setParentType(e.target.value as any)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  >
                    <option value="work_order">Work Order</option>
                    <option value="work_order_line_item">Work Order Line Item</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Parent Entity ID</label>
                  <input
                    type="number"
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    required
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  >
                    <option value="new">New</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Earliest Start Permitted</label>
                  <input
                    type="datetime-local"
                    value={earliestStartPermitted}
                    onChange={(e) => setEarliestStartPermitted(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Due Date</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  />
                </div>
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
