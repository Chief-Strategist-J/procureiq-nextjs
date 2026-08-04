import type { Meta, StoryObj } from '@storybook/react';
import { ApiKeyCard } from './api-key-card';

const meta: Meta<typeof ApiKeyCard> = {
  title: 'Features/Auth/ApiKeyCard',
  component: ApiKeyCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiKeyCard>;

export const Default: Story = {
  args: {
    apiKeys: [
      {
        id: 'key-1',
        name: 'Production Service Credentials',
        keyPrefix: 'piq_live_98a7',
        createdAt: '2026-08-01',
        lastUsedAt: 'Just now',
      },
      {
        id: 'key-2',
        name: 'CI/CD Pipeline Key',
        keyPrefix: 'piq_live_34f1',
        createdAt: '2026-08-03',
        lastUsedAt: '2 hours ago',
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    apiKeys: [],
  },
};
