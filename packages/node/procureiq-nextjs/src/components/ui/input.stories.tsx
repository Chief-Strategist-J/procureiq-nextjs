import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'admin@procureiq.com',
    helperText: 'System notification email.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Purchase Order ID',
    placeholder: 'PO-9942',
    error: 'PO number is required.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Organization Unit',
    placeholder: 'Global Procurement',
    disabled: true,
  },
};
