import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CampaignSchedulesPage from "@/app/campaigns/schedules/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("CampaignSchedulesPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders empty state when backend returns no schedules", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", data: [] }),
    } as Response);

    render(<CampaignSchedulesPage />);

    await waitFor(() => {
      expect(screen.getByText("No scheduled dispatches found.")).toBeInTheDocument();
    });
  });

  test("creates a schedule with a valid ISO scheduledAt timestamp", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (init?.method === "POST") {
        return {
          ok: true,
          json: async () => ({
            status: "success",
            data: { id: 7, orgId: 1, contactId: 4, scheduledAt: "2026-08-01T10:00:00.000Z", status: "pending" },
          }),
        } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    const { container } = render(<CampaignSchedulesPage />);

    await waitFor(() => expect(screen.getByText("No scheduled dispatches found.")).toBeInTheDocument());

    fireEvent.click(screen.getByText("New Schedule"));

    const numberInputs = screen.getAllByRole("spinbutton");
    // Order in the form: Org ID, Campaign ID, Contact ID, Template ID
    fireEvent.change(numberInputs[2], { target: { value: "4" } });

    const datetimeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(datetimeInput, { target: { value: "2026-08-01T10:00" } });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/campaigns/schedules"),
        expect.objectContaining({ method: "POST" })
      );
    });

    const postCall = fetchMock.mock.calls.find(([, init]) => (init as RequestInit | undefined)?.method === "POST");
    const body = JSON.parse((postCall?.[1] as RequestInit).body as string);
    expect(body.contactId).toBe(4);
    expect(body.scheduledAt).toBe(new Date("2026-08-01T10:00").toISOString());
  });
});
