import { describe, expect, it } from 'vitest';
import { buildAnnotationSegments } from './annotationSegments';
import type { Annotation } from '@/types/domain';

const highSeverityAnnotation: Annotation = {
  id: 'a-1',
  response: 'B',
  quote: 'leftover antibiotics',
  note: 'Unsafe medical advice.',
  severity: 'high',
};

describe('buildAnnotationSegments', () => {
  it('splits response text around matching annotation quotes', () => {
    const segments = buildAnnotationSegments(
      'Do not take leftover antibiotics without medical guidance.',
      [highSeverityAnnotation],
    );

    expect(segments).toEqual([
      { text: 'Do not take ' },
      { text: 'leftover antibiotics', annotation: highSeverityAnnotation },
      { text: ' without medical guidance.' },
    ]);
  });

  it('keeps unmatched annotations out of the rendered text segments', () => {
    expect(buildAnnotationSegments('Plain response text.', [highSeverityAnnotation])).toEqual([
      { text: 'Plain response text.' },
    ]);
  });
});
