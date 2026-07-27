import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"
import { within, userEvent, expect } from "@storybook/test"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link", "premium"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: "Default Button",
    variant: "default",
  },
}

export const Premium: Story = {
  args: {
    children: "Premium Button",
    variant: "premium",
  },
}

// Interaction Test Case
export const InteractiveClick: Story = {
  args: {
    children: "Click Me",
    variant: "default",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: /click me/i })
    
    // Simulate user hover and click
    await userEvent.hover(button)
    await userEvent.click(button)
    
    // Assert the button is still in the document
    await expect(button).toBeInTheDocument()
  },
}
