import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { jobsActions } from "./jobsSlice";
import { Job } from "@/app/jobs/types";

export class JobsPageState {
  constructor(
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: Job[],
    public loading: boolean,
    public error: any,
    public success: any,
    public runs: any[],
    public runsLoading: boolean,
    public runsError: any,
    public triggerSuccess: any,
    public jobsUi: any
  ) {}

  get query() {
    return this.jobsUi.searchQuery;
  }

  get isModalOpen() {
    return this.jobsUi.isModalOpen;
  }

  get modalMode() {
    return this.jobsUi.modalMode;
  }

  get editingId() {
    return this.jobsUi.editingId;
  }

  get orgId() {
    return this.jobsUi.formFields.orgId ?? "1";
  }

  get categoryId() {
    return this.jobsUi.formFields.categoryId ?? "";
  }

  get name() {
    return this.jobsUi.formFields.name ?? "";
  }

  get status() {
    return this.jobsUi.formFields.status ?? "active";
  }

  get configText() {
    return this.jobsUi.formFields.configText ?? "{}";
  }

  get configError() {
    return this.jobsUi.formFields.configError ?? "";
  }

  get isRunsModalOpen() {
    return !!this.jobsUi.formFields.isRunsModalOpen;
  }

  get runsJob(): Job | null {
    return this.jobsUi.formFields.runsJob ?? null;
  }

  openCreateModal = () => {
    this.dispatch(jobsActions.openModal({
      mode: "create",
      initialFields: { orgId: "1", categoryId: "", name: "", status: "active", configText: "{}", configError: "" }
    }));
  };

  openEditModal = (item: Job) => {
    this.dispatch(jobsActions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: {
        orgId: item.orgId.toString(),
        categoryId: item.categoryId?.toString() || "",
        name: item.name,
        status: item.status,
        configText: JSON.stringify(item.config ?? {}, null, 2),
        configError: ""
      }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.name.trim()) return;

    let config: Record<string, unknown>;
    try {
      config = this.configText.trim() ? JSON.parse(this.configText) : {};
    } catch {
      this.dispatch(jobsActions.setFormField({ field: "configError", value: "Config must be valid JSON." }));
      return;
    }

    const payload: Omit<Job, "id"> = { orgId: parseInt(this.orgId) || 1, name: this.name, status: this.status, config };
    if (this.categoryId) (payload as any).categoryId = parseInt(this.categoryId);

    if (this.modalMode === "create") {
      this.dispatch(jobsActions.createJobRequest(payload));
    } else if (this.modalMode === "edit" && this.editingId !== null) {
      this.dispatch(jobsActions.updateJobRequest({ id: this.editingId, data: payload }));
    }
  };

  handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    this.dispatch(jobsActions.deleteJobRequest(id));
  };

  openRunsModal = (job: Job) => {
    this.dispatch(jobsActions.setFormField({ field: "runsJob", value: job }));
    this.dispatch(jobsActions.setFormField({ field: "isRunsModalOpen", value: true }));
    this.dispatch(jobsActions.fetchRunsRequest(job.id));
  };

  handleTriggerRun = (jobId: number) => {
    this.dispatch(jobsActions.triggerJobRequest(jobId));
  };

  get filteredItems() {
    return this.items.filter((item) => {
      if (!this.query) return true;
      const q = this.query.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.status.toLowerCase().includes(q) || item.id.toString().includes(q);
    });
  }
}

export function useJobsPageState() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.jobs.jobs.data) as Job[];
  const loading = useAppSelector((s) => s.jobs.jobs.status === "loading");
  const error = useAppSelector((s) => s.jobs.jobs.error);
  const success = useAppSelector((s) => s.jobs.jobs.lastAction);

  const runs = useAppSelector((s) => s.jobs.runs.data);
  const runsLoading = useAppSelector((s) => s.jobs.runs.status === "loading");
  const runsError = useAppSelector((s) => s.jobs.runs.error);
  const triggerSuccess = useAppSelector((s) => s.jobs.runs.lastAction);

  const jobsUi = useAppSelector((s) => s.jobs.jobs.ui);

  useEffect(() => {
    dispatch(jobsActions.fetchJobsRequest());
  }, [dispatch]);

  return new JobsPageState(
    dispatch,
    items,
    loading,
    error,
    success,
    runs,
    runsLoading,
    runsError,
    triggerSuccess,
    jobsUi
  );
}
