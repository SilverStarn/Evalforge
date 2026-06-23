import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  args: {
    status: 'needs_review',
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NeedsReview: Story = {};

export const Approved: Story = {
  args: {
    status: 'approved',
  },
};
