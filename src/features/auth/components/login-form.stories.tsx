import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './login-form';

const meta: Meta<typeof LoginForm> = {
  title: 'Features/Auth/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

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

export const ErrorState: Story = {
  args: {
    isLoading: false,
    errorMessage: 'Invalid username or password',
  },
};

export const AccountLockout: Story = {
  args: {
    isLoading: false,
    errorMessage: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
  },
};
