import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'error', 'info', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Default Badge',
    variant: 'default',
  },
};

export const Success: Story = {
  args: {
    children: 'Approved',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Pending Review',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Rejected',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    children: 'Enterprise',
    variant: 'info',
  },
};

export const Neutral: Story = {
  args: {
    children: 'Draft',
    variant: 'neutral',
  },
};
