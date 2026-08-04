import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Image: Story = {
  render: () => (
    <Avatar className="h-10 w-10">
      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Jaydeep Vagh" />
      <AvatarFallback>JV</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar className="h-10 w-10">
      <AvatarFallback>JV</AvatarFallback>
    </Avatar>
  ),
};
