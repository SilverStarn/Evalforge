import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';

const meta = {
  title: 'UI/MetricCard',
  component: MetricCard,
  args: {
    label: 'Agreement rate',
    value: '76%',
    detail: 'Across comparable tasks',
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
