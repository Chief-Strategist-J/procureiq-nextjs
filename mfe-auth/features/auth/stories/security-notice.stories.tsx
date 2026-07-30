import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { SecurityNotice } from "../components/security-notice"

const meta: Meta<typeof SecurityNotice> = {
  title: "Auth/SecurityNotice",
  component: SecurityNotice,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SecurityNotice>

export const Default: Story = {
  args: {
    message: "Ensure API keys are stored securely. Never commit them to version control pipeline. Regenerate compromised keys immediately.",
  },
}
