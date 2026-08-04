import type { Meta, StoryObj } from '@storybook/react';
import { AuthStatusDialog } from './auth-status-dialog';

const meta: Meta<typeof AuthStatusDialog> = {
  title: 'Features/Auth/AuthStatusDialog',
  component: AuthStatusDialog,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    type: { control: 'select', options: ['error', 'success', 'lockout', 'info'] },
    title: { control: 'text' },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AuthStatusDialog>;

export const ErrorDialog: Story = {
  args: {
    isOpen: true,
    type: 'error',
    title: 'Authentication Error',
    message: 'Invalid username or password credentials provided.',
    onClose: () => {},
    actionText: 'Try Again',
  },
};

export const AccountLockoutDialog: Story = {
  args: {
    isOpen: true,
    type: 'lockout',
    title: 'Account Temporarily Locked',
    message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
    onClose: () => {},
    actionText: 'Dismiss',
  },
};

export const SuccessDialog: Story = {
  args: {
    isOpen: true,
    type: 'success',
    title: 'Authentication Succeeded',
    message: 'Session token issued successfully. Redirecting to IAM Dashboard.',
    onClose: () => {},
    actionText: 'OK',
  },
};
