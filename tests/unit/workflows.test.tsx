import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WorkflowsPage from "@/app/workflows/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("WorkflowsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders empty state when backend returns no workflows", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", data: [] }),
    } as Response);

    render(<WorkflowsPage />);

    await waitFor(() => {
      expect(screen.getByText("No workflows found.")).toBeInTheDocument();
    });
  });

  test("creates a workflow via the modal form", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (init?.method === "POST") {
        return {
          ok: true,
          json: async () => ({ status: "success", data: { id: 9, orgId: 1, name: "Escalation Chain", status: "active" } }),
        } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    render(<WorkflowsPage />);
    await waitFor(() => expect(screen.getByText("No workflows found.")).toBeInTheDocument());

    fireEvent.click(screen.getByText("New Workflow"));
    fireEvent.change(screen.getByPlaceholderText("e.g. Vendor Onboarding Approval Chain"), {
      target: { value: "Escalation Chain" },
    });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/workflows"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ orgId: 1, name: "Escalation Chain", status: "active" }),
        })
      );
    });
  });

  test("falls back to seeded local workflows when backend is offline", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    render(<WorkflowsPage />);

    await waitFor(() => {
      expect(screen.getByText("Vendor Onboarding Approval Chain")).toBeInTheDocument();
    });
  });

  test("opens the runs modal and triggers a new run", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      const u = url as string;
      if (u.endsWith("/api/v1/workflows")) {
        return {
          ok: true,
          json: async () => ({ status: "success", data: [{ id: 1, orgId: 1, name: "Approval Chain", status: "active" }] }),
        } as Response;
      }
      if (u.includes("/runs") && init?.method === "POST") {
        return { ok: true, json: async () => ({ status: "success", data: { id: 1, workflowId: 1, status: "running", createdAt: new Date().toISOString() } }) } as Response;
      }
      if (u.includes("/runs")) {
        return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    const { container } = render(<WorkflowsPage />);
    await waitFor(() => expect(screen.getByText("Approval Chain")).toBeInTheDocument());

    // Row action order: Trigger Run, View Runs (history), Edit, Delete
    const rowButtons = container.querySelectorAll("tbody tr td:last-child button");
    fireEvent.click(rowButtons[1]);

    await waitFor(() => expect(screen.getByText("Trigger New Run")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Trigger New Run"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/v1/workflows/1/runs"), expect.objectContaining({ method: "POST" }));
    });
  });
});
