import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CampaignListPage from "@/app/campaigns/list/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("CampaignListPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders empty state when backend returns no campaigns", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", data: [] }),
    } as Response);

    render(<CampaignListPage />);

    await waitFor(() => {
      expect(screen.getByText("No campaigns found in registry.")).toBeInTheDocument();
    });
  });

  test("creates a campaign via the modal form and posts the correct payload", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (init?.method === "POST") {
        return {
          ok: true,
          json: async () => ({ status: "success", data: { id: 99, orgId: 1, name: "Launch Blast", status: "draft" } }),
        } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    render(<CampaignListPage />);

    await waitFor(() => expect(screen.getByText("No campaigns found in registry.")).toBeInTheDocument());

    fireEvent.click(screen.getByText("New Campaign"));
    fireEvent.change(screen.getByPlaceholderText("e.g. Q3 Vendor Renewal Outreach"), {
      target: { value: "Launch Blast" },
    });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/campaigns"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ orgId: 1, name: "Launch Blast", status: "draft" }),
        })
      );
    });
  });

  test("falls back to local sandbox storage when backend is offline", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    render(<CampaignListPage />);

    await waitFor(() => {
      expect(screen.getByText("Q3 Vendor Renewal Outreach")).toBeInTheDocument();
    });
  });
});
