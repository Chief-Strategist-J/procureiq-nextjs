import type { Meta, StoryObj } from '@storybook/react';
import { ForgotPasswordForm } from '../components/forgot-password-form';

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Features/Auth/ForgotPasswordForm',
  component: ForgotPasswordForm,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    successMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ForgotPasswordForm>;

export const Default: Story = {
  args: {
    isLoading: false,
  },
};

export const Success: Story = {
  args: {
    isLoading: false,
    successMessage: 'A password recovery link has been dispatched to your email address.',
  },
};
