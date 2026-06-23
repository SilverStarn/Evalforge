import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: {
    children: (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-950">Review summary</h2>
        <p className="text-sm text-slate-600">
          Cards frame repeated items, tools, and focused panels.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
