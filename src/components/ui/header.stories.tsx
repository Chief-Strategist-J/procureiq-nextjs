import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    notificationCount: { control: 'number' },
    userName: { control: 'text' },
    userRole: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    notificationCount: 4,
    userName: 'Jaydeep Vagh',
    userRole: 'Lead Strategist',
  },
};

export const NoNotifications: Story = {
  args: {
    notificationCount: 0,
    userName: 'Sarah Connor',
    userRole: 'Procurement Specialist',
  },
};
