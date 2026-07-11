import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ScheduleEmailPage from "@/app/email/schedule/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("ScheduleEmailPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockPush.mockClear();
  });

  test("schedules an email with an ISO scheduled_for timestamp", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 5,
        recipients: ["a@example.com"],
        subject: "Test Subject",
        body: "Test body content",
        scheduled_for: "2026-08-01T10:00:00.000Z",
        status: "pending",
        created_at: "2026-07-11T00:00:00.000Z",
      }),
    } as Response);

    const { container } = render(<ScheduleEmailPage />);

    fireEvent.change(screen.getByPlaceholderText("procurement@acme.example, supply@globex.example"), {
      target: { value: "a@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Vendor Insurance Certificate Reminder"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write the message content here..."), {
      target: { value: "Test body content" },
    });

    const datetimeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(datetimeInput, { target: { value: "2026-08-01T10:00" } });

    fireEvent.click(screen.getByText("Schedule"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/email/schedule"),
        expect.objectContaining({ method: "POST" })
      );
    });

    const call = fetchMock.mock.calls[0];
    const sentBody = JSON.parse((call[1] as RequestInit).body as string);
    expect(sentBody.scheduled_for).toBe(new Date("2026-08-01T10:00").toISOString());
  });

  test("falls back to local sandbox scheduling when the Python service is unreachable", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    const { container } = render(<ScheduleEmailPage />);

    fireEvent.change(screen.getByPlaceholderText("procurement@acme.example, supply@globex.example"), {
      target: { value: "a@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Vendor Insurance Certificate Reminder"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write the message content here..."), {
      target: { value: "Test body content" },
    });
    const datetimeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(datetimeInput, { target: { value: "2026-08-01T10:00" } });

    fireEvent.click(screen.getByText("Schedule"));

    await waitFor(() => {
      expect(screen.getByText("Email scheduled successfully.")).toBeInTheDocument();
    });

    const stored = JSON.parse(localStorage.getItem("piq_scheduled_emails") || "[]");
    expect(stored[0].subject).toBe("Test Subject");
  });
});
