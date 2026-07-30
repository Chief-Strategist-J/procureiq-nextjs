import type { Meta, StoryObj } from "@storybook/react"
import { EmailVerificationCard } from "../components/email-verification-card"

const meta: Meta<typeof EmailVerificationCard> = {
  title: "Auth/EmailVerificationCard",
  component: EmailVerificationCard,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof EmailVerificationCard>

export const Default: Story = {
  args: {
    onVerify: (payload) => console.log("Email verify submitted:", payload),
    initialEmail: "jane@procureiq.com",
    initialToken: "token_verify_8891",
  },
}
