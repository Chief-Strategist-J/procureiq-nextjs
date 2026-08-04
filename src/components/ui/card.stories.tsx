import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px] bg-slate-900 border-slate-800 text-slate-100">
      <CardHeader>
        <CardTitle>Procurement Request #8492</CardTitle>
        <CardDescription className="text-slate-400">Created 2 hours ago by Operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Category:</span>
            <span className="font-medium">Cloud Infrastructure</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Budget:</span>
            <span className="font-medium text-brand-400">$45,000.00</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        <Button variant="primary" size="sm" className="w-full">Approve</Button>
        <Button variant="outline" size="sm" className="w-full">Review</Button>
      </CardFooter>
    </Card>
  ),
};
