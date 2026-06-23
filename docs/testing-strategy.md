# Testing strategy

## Unit tests

Use Vitest for pure functions:

- Rubric schema validation.
- Score completion rules.
- Analytics calculations.
- Filtering utilities.

## Component tests

Use Testing Library for components with real user interactions:

- Rating scale.
- Rubric form.
- Annotation editor.
- Task filters.
- Locale switcher.

Prefer queries by role, label, and visible text.

## End-to-end tests

Use Playwright for complete flows:

- Complete a review task.
- Filter the task queue.
- Resolve a disagreement.
- Switch locales.

## Accessibility smoke tests

Use Playwright against primary pages. The smoke tests should verify headings, labels, keyboard reachability, and obvious violations.

## CI expectations

Pull requests should run:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```
