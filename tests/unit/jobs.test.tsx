import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobsPage from "@/app/jobs/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("JobsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders empty state when backend returns no jobs", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", data: [] }),
    } as Response);

    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText("No jobs found in scheduler.")).toBeInTheDocument();
    });
  });

  test("rejects invalid JSON in the config field without submitting", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", data: [] }),
    } as Response);

    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText("No jobs found in scheduler.")).toBeInTheDocument());

    fireEvent.click(screen.getByText("New Job"));
    fireEvent.change(screen.getByPlaceholderText("e.g. Nightly Vendor Sync"), { target: { value: "My Job" } });

    const configTextarea = screen.getByDisplayValue("{}");
    fireEvent.change(configTextarea, { target: { value: "{not valid json" } });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.getByText("Config must be valid JSON.")).toBeInTheDocument();
    });
  });

  test("creates a job with parsed config JSON", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (init?.method === "POST" && !(url as string).includes("/runs")) {
        return {
          ok: true,
          json: async () => ({ status: "success", data: { id: 3, orgId: 1, name: "My Job", status: "active", config: { retries: 3 } } }),
        } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText("No jobs found in scheduler.")).toBeInTheDocument());

    fireEvent.click(screen.getByText("New Job"));
    fireEvent.change(screen.getByPlaceholderText("e.g. Nightly Vendor Sync"), { target: { value: "My Job" } });
    fireEvent.change(screen.getByDisplayValue("{}"), { target: { value: '{"retries": 3}' } });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/jobs"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ orgId: 1, name: "My Job", status: "active", config: { retries: 3 } }),
        })
      );
    });
  });

  test("triggers a run for a job from the list row", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url) => {
      const u = url as string;
      if (u.endsWith("/api/v1/jobs")) {
        return {
          ok: true,
          json: async () => ({ status: "success", data: [{ id: 1, orgId: 1, name: "Nightly Sync", status: "active", config: {} }] }),
        } as Response;
      }
      if (u.includes("/runs")) {
        return { ok: true, json: async () => ({ status: "success", data: { id: 1, jobId: 1, status: "running", createdAt: new Date().toISOString() } }) } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText("Nightly Sync")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Trigger Run"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/v1/jobs/1/runs"), expect.objectContaining({ method: "POST" }));
    });
  });
});
