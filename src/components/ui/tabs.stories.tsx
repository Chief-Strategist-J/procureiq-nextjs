import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4 bg-slate-900 rounded-md border border-slate-800 text-sm">
        Manage your ProcureIQ account settings.
      </TabsContent>
      <TabsContent value="password" className="p-4 bg-slate-900 rounded-md border border-slate-800 text-sm">
        Change your password credentials.
      </TabsContent>
    </Tabs>
  ),
};
