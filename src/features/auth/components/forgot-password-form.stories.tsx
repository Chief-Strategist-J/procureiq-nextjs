import type { Meta, StoryObj } from '@storybook/react';
import { ForgotPasswordForm } from './forgot-password-form';

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

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const SuccessState: Story = {
  args: {
    isLoading: false,
    successMessage: 'Password recovery instructions have been sent to your work email address.',
  },
};
