import type { Meta, StoryObj } from "@storybook/react"
import { ForgotPasswordForm } from "../components/forgot-password-form"

const meta: Meta<typeof ForgotPasswordForm> = {
  title: "Auth/ForgotPasswordForm",
  component: ForgotPasswordForm,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ForgotPasswordForm>

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log("Forgot password submitted:", data),
  },
}

export const SuccessState: Story = {
  args: {
    onSubmit: () => {},
    successMessage: "Password reset instructions have been dispatched to your email.",
  },
}
