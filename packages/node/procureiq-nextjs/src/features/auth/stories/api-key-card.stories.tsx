import type { Meta, StoryObj } from '@storybook/react';
import { ApiKeyCard } from '../components/api-key-card';

const sampleKeys = [
  {
    id: 'key-01',
    name: 'Production Gateway Integration',
    keyPrefix: 'piq_live_9942a',
    createdAt: '2026-06-15T10:00:00Z',
    lastUsedAt: '2026-08-04T12:00:00Z',
  },
  {
    id: 'key-02',
    name: 'Staging Environment Webhook',
    keyPrefix: 'piq_stage_3311b',
    createdAt: '2026-07-01T14:30:00Z',
    lastUsedAt: '2026-08-02T09:15:00Z',
  },
];

const meta: Meta<typeof ApiKeyCard> = {
  title: 'Features/Auth/ApiKeyCard',
  component: ApiKeyCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiKeyCard>;

export const Default: Story = {
  args: {
    apiKeys: sampleKeys,
  },
};

export const Empty: Story = {
  args: {
    apiKeys: [],
  },
};
