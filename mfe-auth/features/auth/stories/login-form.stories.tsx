import type { Meta, StoryObj } from "@storybook/react"
import { LoginForm } from "../components/login-form"

const meta: Meta<typeof LoginForm> = {
  title: "Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  args: {
    onSubmit: (cred) => console.log("Login submitted:", cred),
  },
}

export const LoadingState: Story = {
  args: {
    onSubmit: () => {},
    loading: true,
  },
}

export const ErrorState: Story = {
  args: {
    onSubmit: () => {},
    error: "Invalid username or password.",
  },
}
