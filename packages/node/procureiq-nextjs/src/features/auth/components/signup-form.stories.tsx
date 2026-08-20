import type { Meta, StoryObj } from '@storybook/react';
import { SignupForm } from './signup-form';

const meta: Meta<typeof SignupForm> = {
  title: 'Features/Auth/SignupForm',
  component: SignupForm,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SignupForm>;

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
    errorMessage: 'Work email address is already registered.',
  },
};
