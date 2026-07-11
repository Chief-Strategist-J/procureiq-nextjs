import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendEmailPage from "@/app/email/send/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("SendEmailPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockPush.mockClear();
  });

  test("sends an email with a parsed recipients array and reads the unwrapped response body", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", message: "Email sent successfully" }),
    } as Response);

    render(<SendEmailPage />);

    fireEvent.change(screen.getByPlaceholderText("procurement@acme.example, supply@globex.example"), {
      target: { value: "a@example.com, b@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Vendor Insurance Certificate Reminder"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write the message content here..."), {
      target: { value: "Test body content" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/email/send"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            recipients: ["a@example.com", "b@example.com"],
            subject: "Test Subject",
            body: "Test body content",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Email sent successfully")).toBeInTheDocument();
    });
  });

  test("simulates a send locally when the Python service is unreachable", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    render(<SendEmailPage />);

    fireEvent.change(screen.getByPlaceholderText("procurement@acme.example, supply@globex.example"), {
      target: { value: "a@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Vendor Insurance Certificate Reminder"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write the message content here..."), {
      target: { value: "Test body content" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(screen.getByText(/Offline Sandbox/i)).toBeInTheDocument();
    });
  });
});
