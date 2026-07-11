import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CampaignsHub from "@/app/campaigns/page";
import { expect, test, vi, beforeEach, describe } from "vitest";
import "@testing-library/jest-dom";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("CampaignsHub", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockPush.mockClear();
  });

  test("renders the three campaign section cards", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));

    render(<CampaignsHub />);

    expect(screen.getByText("Campaigns Hub")).toBeInTheDocument();
    expect(screen.getByText("Campaigns")).toBeInTheDocument();
    expect(screen.getByText("Recipients")).toBeInTheDocument();
    expect(screen.getByText("Schedules")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText("Manage Records").length).toBe(3);
    });
  });

  test("falls back to seeded local data when backend is unreachable", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));

    render(<CampaignsHub />);

    await waitFor(() => {
      expect(localStorage.getItem("piq_campaigns")).not.toBeNull();
      expect(localStorage.getItem("piq_recipients")).not.toBeNull();
      expect(localStorage.getItem("piq_campaign_schedules")).not.toBeNull();
    });
  });
});
