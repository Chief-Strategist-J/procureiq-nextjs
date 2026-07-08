import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

describe("ForgotPasswordDialog Unit Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("renders the trigger button and opens dialog on click", async () => {
    render(
      <ForgotPasswordDialog 
        trigger={<button data-testid="trigger-btn">Forgot Password</button>} 
      />
    );

    const trigger = screen.getByTestId("trigger-btn");
    expect(trigger).toBeInTheDocument();

    // Click trigger to open dialog
    fireEvent.click(trigger);

    // Verify dialog headers are visible
    expect(screen.getByText("Request Password Reset")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
  });

  test("handles successful API calls and shows checkmark dispatch framework", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      text: async () => "Success",
    } as Response);

    render(
      <ForgotPasswordDialog 
        trigger={<button data-testid="trigger-btn">Forgot Password</button>} 
      />
    );

    fireEvent.click(screen.getByTestId("trigger-btn"));

    // Enter email input
    const input = screen.getByPlaceholderText("name@company.com");
    fireEvent.change(input, { target: { value: "test@corporate.com" } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Send Reset Link/i });
    fireEvent.click(submitBtn);

    // Verify loading state
    expect(screen.getByText("Dispatching...")).toBeInTheDocument();

    // Wait for success screen
    await waitFor(() => {
      expect(screen.getByText("Dispatched Successfully")).toBeInTheDocument();
    });

    // Check email payload is verified in description
    expect(screen.getByText(/test@corporate.com/i)).toBeInTheDocument();

    // Verify correct API endpoint was called
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/forgot-password"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "test@corporate.com" }),
      })
    );
  });

  test("handles failed API calls and shows descriptive FieldError feedback", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      text: async () => "Account not registered in platform catalog.",
    } as Response);

    render(
      <ForgotPasswordDialog 
        trigger={<button data-testid="trigger-btn">Forgot Password</button>} 
      />
    );

    fireEvent.click(screen.getByTestId("trigger-btn"));

    const input = screen.getByPlaceholderText("name@company.com");
    fireEvent.change(input, { target: { value: "missing@corporate.com" } });

    const submitBtn = screen.getByRole("button", { name: /Send Reset Link/i });
    fireEvent.click(submitBtn);

    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByText(/Account not registered in platform catalog./i)).toBeInTheDocument();
    });
  });
});
