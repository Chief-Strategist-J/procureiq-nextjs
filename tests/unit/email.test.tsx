import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EmailPage from "@/app/email/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("EmailPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders the scheduled queue returned by the (unwrapped) Python service response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ([
        {
          id: 1,
          recipients: ["a@example.com"],
          subject: "Renewal Notice",
          body: "Please renew.",
          scheduled_for: "2026-08-01T10:00:00.000Z",
          status: "pending",
          created_at: "2026-07-11T00:00:00.000Z",
        },
      ]),
    } as Response);

    render(<EmailPage />);

    await waitFor(() => {
      expect(screen.getByText("Renewal Notice")).toBeInTheDocument();
      expect(screen.getByText("a@example.com")).toBeInTheDocument();
    });
  });

  test("falls back to seeded local data when the Python service is unreachable", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    render(<EmailPage />);

    await waitFor(() => {
      expect(screen.getByText("Vendor Insurance Certificate Reminder")).toBeInTheDocument();
    });
  });
});
