import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { UserAccountList } from "../components/user-account-list"

const meta: Meta<typeof UserAccountList> = {
  title: "Auth/UserAccountList",
  component: UserAccountList,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof UserAccountList>

export const Default: Story = {
  args: {
    users: [
      { name: "John Doe", role: "Procurement Manager", email: "john@procureiq.com", status: "Active" },
      { name: "Jane Smith", role: "Financial Auditor", email: "jane@procureiq.com", status: "Active" },
      { name: "Bob Johnson", role: "System Dispatcher", email: "bob@procureiq.com", status: "Suspended" },
    ],
  },
}

export const Empty: Story = {
  args: {
    users: [],
  },
}
