import { memo, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { buildAnnotationSegments } from './annotationSegments';
import type { Annotation, ResponseSide } from '@/types/domain';

interface ResponsePanelProps {
  side: ResponseSide;
  title: string;
  response: string;
  annotations: Annotation[];
  onCaptureSelection: (side: ResponseSide) => void;
}

export const ResponsePanel = memo(function ResponsePanel({
  side,
  title,
  response,
  annotations,
  onCaptureSelection,
}: ResponsePanelProps) {
  const segments = useMemo(
    () => buildAnnotationSegments(response, annotations),
    [annotations, response],
  );

  return (
    <Card
      className="space-y-3 border-t-4 border-t-slate-300"
      onMouseUp={() => onCaptureSelection(side)}
    >
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="whitespace-pre-wrap leading-7 text-slate-700">
        {segments.map((segment, index) =>
          segment.annotation ? (
            <mark
              key={`${segment.annotation.id}-${index}`}
              className="rounded bg-amber-100 px-0.5 text-slate-950"
              title={segment.annotation.note}
            >
              {segment.text}
            </mark>
          ) : (
            <span key={`${side}-${index}`}>{segment.text}</span>
          ),
        )}
      </p>
    </Card>
  );
});
