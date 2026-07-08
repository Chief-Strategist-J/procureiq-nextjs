import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/reset-password/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

// Setup mocks for next/navigation
let mockToken = "valid-token-xyz";
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "token" ? mockToken : null),
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("ResetPasswordPage Unit Tests", () => {
  beforeEach(() => {
    mockToken = "valid-token-xyz";
    vi.restoreAllMocks();
  });

  test("renders form inputs when token is present", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByText("Reset Credentials")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.queryByText(/Token Missing/i)).not.toBeInTheDocument();
  });

  test("displays warning when token is missing (edge case)", () => {
    mockToken = ""; // Empty token simulation
    render(<ResetPasswordPage />);
    expect(screen.getByText(/Token Missing/i)).toBeInTheDocument();
  });

  test("validates password length rule (edge case)", async () => {
    render(<ResetPasswordPage />);
    
    const passwordInput = screen.getByLabelText("New Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitBtn = screen.getByRole("button", { name: /Reset Password/i });

    // Enter short password
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmInput, { target: { value: "short" } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });

  test("validates matching passwords rule (edge case)", async () => {
    render(<ResetPasswordPage />);
    
    const passwordInput = screen.getByLabelText("New Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitBtn = screen.getByRole("button", { name: /Reset Password/i });

    // Enter non-matching passwords
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password456" } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Confirmation password does not match/i)).toBeInTheDocument();
  });

  test("handles successful API password reset request", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      text: async () => "Updated",
    } as Response);

    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitBtn = screen.getByRole("button", { name: /Reset Password/i });

    fireEvent.change(passwordInput, { target: { value: "validpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "validpassword123" } });
    fireEvent.click(submitBtn);

    // Verify loading label is displayed
    expect(screen.getByText("Updating Credentials...")).toBeInTheDocument();

    // Verify success screen
    await waitFor(() => {
      expect(screen.getByText("Credentials Revitalized")).toBeInTheDocument();
    });

    // Check correct API endpoint call details
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/reset-password"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token: "valid-token-xyz", newPassword: "validpassword123" }),
      })
    );
  });

  test("handles failed reset request from backend (expired token edge case)", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      text: async () => "Reset signature expired.",
    } as Response);

    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitBtn = screen.getByRole("button", { name: /Reset Password/i });

    fireEvent.change(passwordInput, { target: { value: "validpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "validpassword123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Reset signature expired./i)).toBeInTheDocument();
    });
  });
});
