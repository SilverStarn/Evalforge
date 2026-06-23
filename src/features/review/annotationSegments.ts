import type { Annotation } from '@/types/domain';

export interface AnnotationSegment {
  text: string;
  annotation?: Annotation;
}

export function buildAnnotationSegments(
  text: string,
  annotations: Annotation[],
): AnnotationSegment[] {
  if (!annotations.length) {
    return [{ text }];
  }

  const matches = annotations
    .map((annotation) => ({
      annotation,
      start: text.indexOf(annotation.quote),
      end: text.indexOf(annotation.quote) + annotation.quote.length,
    }))
    .filter((match) => match.start >= 0 && match.end > match.start)
    .sort((first, second) => first.start - second.start);

  const segments: AnnotationSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start < cursor) {
      continue;
    }

    if (match.start > cursor) {
      segments.push({ text: text.slice(cursor, match.start) });
    }

    segments.push({
      text: text.slice(match.start, match.end),
      annotation: match.annotation,
    });
    cursor = match.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments.length ? segments : [{ text }];
}
