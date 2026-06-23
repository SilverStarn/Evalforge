# Accessibility notes

## Baseline

EvalForge treats accessibility issues as functional issues. The primary workflows must work with keyboard, screen-reader-friendly labels, visible focus states, and predictable layout behavior.

## Implementation checklist

- Use semantic headings in order.
- Use native buttons and form controls where possible.
- Provide labels for every input and select.
- Connect validation errors to the relevant field.
- Keep visible focus states on all interactive elements.
- Use live regions for save/submission status changes.
- Do not rely on color alone for status or severity.
- Keep response comparison readable at narrow widths.
- Support reduced-motion preferences.
- Verify the Arabic locale with `dir="rtl"`.

## Manual smoke test

1. Open `/tasks`.
2. Tab through the queue filters and first task action.
3. Open `/review/t-1001`.
4. Score the task using only keyboard input.
5. Submit the review.
6. Switch to Arabic in the header.
7. Confirm the layout remains usable and text direction changes.

## Automated checks

Run:

```bash
npm run test:a11y
```

The smoke tests should not be treated as full coverage. They catch obvious regressions and make manual review easier.
