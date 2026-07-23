import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { githubActions } from "./githubSlice";
import { ActionTemplate } from "@/app/github/types";

export class GitHubDashboardState {
  constructor(
    public dispatch: ReturnType<typeof useAppDispatch>,
    public owner: string,
    public setOwner: (val: string) => void,
    public repo: string,
    public setRepo: (val: string) => void,
    public query: string,
    public setQuery: (val: string) => void,
    public categoryFilter: string,
    public setCategoryFilter: (val: string) => void,
    public busyId: number | null,
    public setBusyId: (val: number | null) => void,
    public yamlTemplate: ActionTemplate | null,
    public setYamlTemplate: (val: ActionTemplate | null) => void,
    public templatesState: any,
    public repoInfoState: any,
    public runsState: any,
    public operationsState: any
  ) {}

  get templates() {
    return Array.isArray(this.templatesState.data) ? this.templatesState.data : [];
  }

  get loading() {
    return this.templatesState.status === 'loading';
  }

  get error() {
    return this.templatesState.error || this.operationsState.dispatch.error || this.operationsState.deploy.error;
  }

  get success() {
    return (this.operationsState.dispatch.status === 'succeeded' && this.operationsState.dispatch.data) ? "Triggered successfully" :
           (this.operationsState.deploy.status === 'succeeded' && this.operationsState.deploy.data ? "Deployed successfully" : "");
  }

  handleLookupRepo = () => {
    if (!this.owner || !this.repo) return;
    this.dispatch(githubActions.repo.fetchRequest({ owner: this.owner, repo: this.repo }));
  };

  handleRefreshRuns = () => {
    if (!this.owner || !this.repo) return;
    this.dispatch(githubActions.runs.fetchRequest({ owner: this.owner, repo: this.repo }));
  };

  handleDeploy = (template: ActionTemplate) => {
    if (!this.owner || !this.repo) return;
    this.setBusyId(template.id);
    this.dispatch(githubActions.operations.deployRequest({ owner: this.owner, repo: this.repo, template }));
  };

  handleTrigger = (template: ActionTemplate) => {
    if (!this.owner || !this.repo) return;
    this.setBusyId(template.id);
    this.dispatch(githubActions.operations.dispatchRequest({ owner: this.owner, repo: this.repo, eventType: template.eventType, templateId: template.id }));
  };

  get categories() {
    return Array.from(new Set(this.templates.map((t: any) => t.category))).sort();
  }

  get filteredTemplates() {
    return this.templates.filter((t: any) => {
      if (this.categoryFilter !== "all" && t.category !== this.categoryFilter) return false;
      if (!this.query) return true;
      const q = this.query.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.eventType.toLowerCase().includes(q);
    });
  }

  get anyMockResult() {
    return this.operationsState.deploy.data?.result.mock === true;
  }
}

export function useGitHubDashboardState() {
  const dispatch = useAppDispatch();

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [yamlTemplate, setYamlTemplate] = useState<ActionTemplate | null>(null);

  const templatesState = useAppSelector((state) => state.github.templates.items);
  const repoInfoState = useAppSelector((state) => state.github.repoInfo);
  const runsState = useAppSelector((state) => state.github.runs);
  const operationsState = useAppSelector((state) => state.github.operations);

  useEffect(() => {
    const stored = localStorage.getItem("piq_github_target");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOwner(parsed.owner || "");
        setRepo(parsed.repo || "");
      } catch {
        // ignore malformed local target
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("piq_github_target", JSON.stringify({ owner, repo }));
  }, [owner, repo]);

  const fetchTemplates = useCallback(() => {
    dispatch(githubActions.templates.fetchRequest(undefined));
  }, [dispatch]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    if (operationsState.deploy.status === 'succeeded' && operationsState.deploy.data) {
      setBusyId(null);
    } else if (operationsState.deploy.status === 'failed') {
      setBusyId(null);
    }
  }, [operationsState.deploy]);

  useEffect(() => {
    if (operationsState.dispatch.status === 'succeeded' && operationsState.dispatch.data) {
      setBusyId(null);
    } else if (operationsState.dispatch.status === 'failed') {
      setBusyId(null);
    }
  }, [operationsState.dispatch]);

  return new GitHubDashboardState(
    dispatch,
    owner, setOwner,
    repo, setRepo,
    query, setQuery,
    categoryFilter, setCategoryFilter,
    busyId, setBusyId,
    yamlTemplate, setYamlTemplate,
    templatesState,
    repoInfoState,
    runsState,
    operationsState
  );
}
