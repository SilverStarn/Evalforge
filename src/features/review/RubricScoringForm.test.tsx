import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { rubrics } from '@/data/seed';
import { RubricScoringForm } from './RubricScoringForm';

describe('RubricScoringForm', () => {
  it('renders schema-driven multi-select criteria and reports selected options', async () => {
    const user = userEvent.setup();
    const onScoreChange = vi.fn();

    render(
      <RubricScoringForm
        rubric={rubrics[1]}
        scores={{}}
        errors={{}}
        getErrorMessage={() => undefined}
        onScoreChange={onScoreChange}
      />,
    );

    await user.click(screen.getByLabelText('Broken list'));

    expect(onScoreChange).toHaveBeenCalledWith('formatting', ['Broken list']);
  });
});
