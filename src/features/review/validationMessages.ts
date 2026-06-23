import type { ReviewValidationError } from '@/lib/rubrics/validation';

type Translate = (key: string, options?: Record<string, unknown>) => string;

export function getReviewValidationMessage(error: ReviewValidationError | undefined, t: Translate) {
  if (!error) {
    return undefined;
  }

  if (error.code === 'criterion_required') {
    return t('review.errors.criterionRequired', { label: error.label });
  }

  return t(`review.errors.${error.code}`);
}
