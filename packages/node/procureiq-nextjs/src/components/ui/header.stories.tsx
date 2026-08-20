import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    userName: { control: 'text' },
    userRole: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    userName: 'Jaydeep Vagh',
    userRole: 'Lead Strategist',
  },
};

export const Guest: Story = {
  args: {
    userName: 'IAM Guest',
    userRole: 'Unauthenticated',
  },
};
