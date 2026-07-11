import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipientsPage from "@/app/campaigns/recipients/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("RecipientsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders seeded recipients when the backend is unreachable", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));

    render(<RecipientsPage />);

    await waitFor(() => {
      expect(screen.getByText("Acme Corp Procurement")).toBeInTheDocument();
    });
  });

  test("creates a recipient and omits optional fields left blank", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (init?.method === "POST") {
        return {
          ok: true,
          json: async () => ({ status: "success", data: { id: 5, accountId: 2, name: "Initech" } }),
        } as Response;
      }
      return { ok: true, json: async () => ({ status: "success", data: [] }) } as Response;
    });

    render(<RecipientsPage />);

    await waitFor(() => expect(screen.getByText("No recipients found in directory.")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Add Recipient"));
    fireEvent.change(screen.getByPlaceholderText("e.g. Acme Corp Procurement"), {
      target: { value: "Initech" },
    });
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "2" } });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/campaigns/recipients"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ accountId: 2, name: "Initech" }),
        })
      );
    });
  });
});
