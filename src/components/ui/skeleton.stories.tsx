import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const LoadingCard: Story = {
  render: () => (
    <div className="flex flex-col space-y-3 w-[300px]">
      <Skeleton className="h-[125px] w-full rounded-xl bg-slate-800" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-slate-800" />
        <Skeleton className="h-4 w-[200px] bg-slate-800" />
      </div>
    </div>
  ),
};
