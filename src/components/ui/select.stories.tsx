import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px] bg-slate-900 border-slate-800 text-slate-100">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
        <SelectItem value="hardware">Hardware & Infrastructure</SelectItem>
        <SelectItem value="cloud">Cloud Services</SelectItem>
        <SelectItem value="security">Security & Audit</SelectItem>
      </SelectContent>
    </Select>
  ),
};
