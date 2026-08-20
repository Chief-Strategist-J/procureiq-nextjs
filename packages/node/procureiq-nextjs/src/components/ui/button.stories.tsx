import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'destructive', 'danger', 'outline', 'ghost', 'link', 'premium'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Action',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Action',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete Resource',
    variant: 'danger',
  },
};

export const Premium: Story = {
  args: {
    children: 'Upgrade to Enterprise',
    variant: 'premium',
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving Changes...',
    variant: 'primary',
    isLoading: true,
  },
};
