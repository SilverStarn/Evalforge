# EvalForge agent guide

## Product context

EvalForge is a frontend workbench for structured response evaluation. The core workflows are reviewing paired responses, scoring rubric criteria, capturing annotations, resolving reviewer disagreements, and monitoring quality metrics.

Build it like a real internal product: reliable, accessible, fast, well-tested, and easy to understand.

## Repository layout

- `src/app`: routing, providers, layout, and page-level composition.
- `src/components`: reusable UI components with minimal business logic.
- `src/features`: workflow-specific UI and behavior.
- `src/lib`: API clients, validation, analytics, utilities, and pure functions.
- `src/data`: seed data for the mocked API.
- `src/i18n`: translation setup and dictionaries.
- `src/store`: Redux Toolkit slices for small client workflow state.
- `docs`: architecture notes, quality standards, and task prompts.
- `tests`: Playwright end-to-end and accessibility tests.

## Commands

Use npm.

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Unit/component tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Storybook: `npm run storybook`
- Format check: `npm run format:check`

After editing TypeScript, run the smallest relevant check first. Before a final answer or pull request, run `npm run lint`, `npm run test`, and `npm run build` unless the change is docs-only.

## Engineering standards

- Prefer TypeScript types and Zod schemas over unchecked object shapes.
- Keep feature behavior in feature folders and shared pure logic in `src/lib`.
- Avoid large components. Split UI, data loading, and business rules when a file becomes hard to scan.
- Use TanStack Query for server-like async data. Do not put fetched tasks, rubrics, or submissions into Redux.
- Use Redux only for small client workflow preferences that are genuinely shared across pages.
- Keep forms accessible: every input needs a label, errors must be connected to fields, and submit buttons must expose loading state.
- Use semantic HTML first. Use ARIA only when native HTML does not cover the interaction.
- Preserve keyboard access for every interactive feature.
- Do not remove visible focus styles.
- Keep translated UI strings in `src/i18n/resources.ts`; do not hard-code user-facing labels inside complex components unless the string is test-only.
- For expensive dashboard calculations, prefer pure functions in `src/lib/analytics` and call them from a Web Worker when the UI could block.
- Do not add new production dependencies unless they remove meaningful complexity or improve correctness.

## Testing expectations

When adding or changing behavior:

- Add or update a Vitest test for pure business logic.
- Add or update a component test for interactive components.
- Add or update a Playwright test for a critical user journey.
- Include accessibility checks for new dialogs, forms, and keyboard-heavy interactions.

Use accessible queries in UI tests, such as role, label text, and visible text. Avoid brittle selectors unless there is no better option.

## Review checklist

Before considering work done, check:

- The feature handles loading, empty, error, and success states.
- The UI works by keyboard.
- The UI still works at mobile, tablet, and desktop widths.
- User-facing strings are localizable.
- New logic has tests.
- The diff does not introduce duplicated business rules.
- The code avoids hidden network calls, mock secrets, or unnecessary global state.
- The README or docs are updated when behavior, commands, or architecture changes.

## Implementation style

Make small, coherent changes. Prefer a direct implementation over a broad rewrite. When refactoring, keep behavior stable and cover the change with tests before expanding scope.

If a task is ambiguous, choose the smallest useful interpretation and note the assumption in the final response. Do not leave TODO placeholders in committed code; create a documented issue or roadmap item instead.
