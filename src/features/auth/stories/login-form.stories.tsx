import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from '../components/login-form';

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

export const WithError: Story = {
  args: {
    isLoading: false,
    errorMessage: 'Invalid credentials. Please check your email and password.',
  },
};
