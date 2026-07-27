import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Footer } from "./footer"

const meta: Meta<typeof Footer> = {
  title: "UI/Footer",
  component: Footer,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
  render: () => <Footer />,
}
