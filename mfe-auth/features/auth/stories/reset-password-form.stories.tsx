import type { Meta, StoryObj } from "@storybook/react"
import { ResetPasswordForm } from "../components/reset-password-form"

const meta: Meta<typeof ResetPasswordForm> = {
  title: "Auth/ResetPasswordForm",
  component: ResetPasswordForm,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ResetPasswordForm>

export const Default: Story = {
  args: {
    onSubmit: (payload) => console.log("Reset password submitted:", payload),
    initialToken: "token_mock_12345",
  },
}
