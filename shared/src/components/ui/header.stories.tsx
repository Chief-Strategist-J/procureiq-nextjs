import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Header } from "./header"
import { ThemeProvider } from "next-themes"
import { within, userEvent, expect } from "@storybook/test"

const meta: Meta<typeof Header> = {
  title: "UI/Header",
  component: Header,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="min-h-[400px] w-full bg-background">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Header>

export const PortalActive: Story = {
  args: {
    activePath: "/",
  },
}

// Interaction Test Case: Mobile hamburger menu toggle
export const MobileNavigationTest: Story = {
  args: {
    activePath: "/",
  },
  parameters: {
    // Force mobile viewport in Storybook
    viewport: {
      defaultViewport: "mobile",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Find hamburger menu button by its aria-label
    const menuBtn = canvas.getByRole("button", { name: /toggle menu/i })
    
    // Check that mobile navigation drawer is not open initially (e.g. Host Portal link should not be present in mobile menu context yet)
    // Click to open menu
    await userEvent.click(menuBtn)
    
    // Assert menu content is visible now
    const mobileLink = canvas.getByRole("link", { name: /crypto/i })
    await expect(mobileLink).toBeInTheDocument()
    
    // Click close button
    await userEvent.click(menuBtn)
  },
}
