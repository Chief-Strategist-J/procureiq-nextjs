import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { AuthHeader } from "../components/auth-header"

const meta: Meta<typeof AuthHeader> = {
  title: "Auth/AuthHeader",
  component: AuthHeader,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    port: { control: "number" },
  },
}

export default meta
type Story = StoryObj<typeof AuthHeader>

export const Default: Story = {
  args: {
    title: "Identity & Access Roles",
    description: "Manage user credentials, API keys, and track role assignments.",
    port: 8992,
  },
}

export const CustomPort: Story = {
  args: {
    title: "Authentication Control",
    description: "System administrative console.",
    port: 9000,
  },
}
