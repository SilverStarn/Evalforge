import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RatingScale } from './RatingScale';

describe('RatingScale', () => {
  it('calls onChange with the selected score', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<RatingScale label="Accuracy" value={undefined} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: '4' }));

    expect(onChange).toHaveBeenCalledWith(4);
  });
});
