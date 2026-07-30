import type { Meta, StoryObj } from "@storybook/react"
import { SignupForm } from "../components/signup-form"

const meta: Meta<typeof SignupForm> = {
  title: "Auth/SignupForm",
  component: SignupForm,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SignupForm>

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log("Signup data:", data),
  },
}

export const ErrorState: Story = {
  args: {
    onSubmit: () => {},
    error: "Username or Email is already registered.",
  },
}
