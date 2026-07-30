import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ApiKeyCard } from "../components/api-key-card"

const meta: Meta<typeof ApiKeyCard> = {
  title: "Auth/ApiKeyCard",
  component: ApiKeyCard,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ApiKeyCard>

export const Empty: Story = {
  args: {
    apiKey: "",
    generating: false,
  },
}

export const Generating: Story = {
  args: {
    apiKey: "",
    generating: true,
  },
}

export const Generated: Story = {
  args: {
    apiKey: "pk_live_8f92a10b39c2d1ef99a2",
    generating: false,
  },
}
