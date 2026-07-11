import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GitHubDashboard from "@/app/github/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("GitHubDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders the template catalog from the backend", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "success",
        data: [
          {
            id: 1,
            name: "Lint & Static Analysis Sweep",
            category: "Code Quality & Review",
            description: "Run linters and static analysis across active branches",
            cronExpression: "15 7 * * *",
            eventType: "lint_static_analysis_sweep.requested",
            yamlContent: "name: test\non:\n  workflow_dispatch:\n",
          },
        ],
      }),
    } as Response);

    render(<GitHubDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Lint & Static Analysis Sweep")).toBeInTheDocument();
    });
  });

  test("deploy button calls create-workflow with the template's yaml content", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      const u = url as string;
      if (u.includes("/templates")) {
        return {
          ok: true,
          json: async () => ({
            status: "success",
            data: [
              {
                id: 1,
                name: "Lint & Static Analysis Sweep",
                category: "Code Quality & Review",
                description: "Run linters and static analysis across active branches",
                cronExpression: "15 7 * * *",
                eventType: "lint_static_analysis_sweep.requested",
                yamlContent: "name: test\non:\n  workflow_dispatch:\n",
              },
            ],
          }),
        } as Response;
      }
      if (u.includes("/create-workflow")) {
        return {
          ok: true,
          json: async () => ({
            status: "success",
            data: { path: ".github/workflows/daily-lint.yml", sha: "abc123", htmlUrl: "https://github.com/acme/repo/blob/main/.github/workflows/daily-lint.yml", message: "ci: add", mock: true },
          }),
        } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    render(<GitHubDashboard />);
    await waitFor(() => expect(screen.getByText("Lint & Static Analysis Sweep")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("owner"), { target: { value: "acme" } });
    fireEvent.change(screen.getByPlaceholderText("repo"), { target: { value: "repo" } });
    fireEvent.click(screen.getByText("Deploy"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/github/create-workflow"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("name: test"),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Backend has no/i)).toBeInTheDocument();
    });
  });

  test("trigger button calls dispatch with the template's event type", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      const u = url as string;
      if (u.includes("/templates")) {
        return {
          ok: true,
          json: async () => ({
            status: "success",
            data: [
              {
                id: 1,
                name: "Lint & Static Analysis Sweep",
                category: "Code Quality & Review",
                description: "Run linters and static analysis across active branches",
                cronExpression: "15 7 * * *",
                eventType: "lint_static_analysis_sweep.requested",
                yamlContent: "name: test\n",
              },
            ],
          }),
        } as Response;
      }
      if (u.includes("/dispatch")) {
        return { ok: true, json: async () => ({ status: "success", data: "Repository dispatch triggered successfully" }) } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    render(<GitHubDashboard />);
    await waitFor(() => expect(screen.getByText("Lint & Static Analysis Sweep")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("owner"), { target: { value: "acme" } });
    fireEvent.change(screen.getByPlaceholderText("repo"), { target: { value: "repo" } });
    fireEvent.click(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/github/dispatch"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            owner: "acme",
            repo: "repo",
            eventType: "lint_static_analysis_sweep.requested",
            clientPayload: {},
          }),
        })
      );
    });
  });
});
