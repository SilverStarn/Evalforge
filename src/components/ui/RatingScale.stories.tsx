import type { Meta, StoryObj } from '@storybook/react';
import { RatingScale } from './RatingScale';

const meta = {
  title: 'UI/RatingScale',
  component: RatingScale,
  args: {
    label: 'Factual accuracy',
    value: 4,
    min: 1,
    max: 5,
    required: true,
    onChange: () => undefined,
  },
} satisfies Meta<typeof RatingScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const WithError: Story = {
  args: {
    value: undefined,
    error: 'Factual accuracy is required.',
  },
};
