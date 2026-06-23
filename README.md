# EvalForge

EvalForge is a structured response-evaluation workbench for teams that review generated answers, score them against rubrics, resolve disagreements, and track quality trends.

The app is intentionally frontend-focused. It uses a mocked API layer with realistic latency and seeded data so the interface, state management, accessibility, test coverage, and performance behavior can be developed without waiting on backend services.

## What it does

- Review tasks side by side with structured rubric scoring.
- Capture inline annotations and severity labels.
- Highlight matching annotation quotes directly in response text.
- Autosave review drafts in the browser.
- Move tasks through queue states such as `in_progress`, `submitted`, `needs_review`, and `approved`.
- Share task queue views with URL-backed status and search filters.
- Build and preview rubrics with typed schema validation.
- Resolve reviewer disagreements in a lead-review workflow.
- Monitor quality metrics in a dashboard powered by a Web Worker and export the summary as CSV.
- Switch between English, Spanish, and Arabic to verify localization and right-to-left layout behavior.

## Tech stack

- React, TypeScript, Vite
- TanStack Query for server state
- Redux Toolkit for small client workflow state
- React Router for routing
- Zod for schema validation
- i18next and react-i18next for internationalization
- Tailwind CSS for styling
- Vitest and Testing Library for unit/component tests
- Playwright for end-to-end and accessibility smoke tests
- Storybook for component documentation
- GitHub Actions for CI

## Getting started

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Useful commands

```bash
npm run dev              # start local dev server
npm run build            # type-check and create a production build
npm run lint             # run ESLint
npm run test             # run Vitest tests
npm run test:e2e         # run Playwright tests
npm run storybook        # open component docs
npm run format:check     # verify formatting
```

## Demo paths

| Path             | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| `/`              | Product overview and navigation                     |
| `/tasks`         | Review queue with filters and status changes        |
| `/review/t-1001` | Main side-by-side review workspace                  |
| `/rubrics`       | Rubric list, preview, and schema validation example |
| `/lead-review`   | Disagreement resolution workflow                    |
| `/dashboard`     | Quality analytics and throughput metrics            |
| `/settings`      | Locale, accessibility, and workflow preferences     |

## Architecture overview

```text
src/
  app/                  Application shell, routes, providers
  components/           Reusable UI primitives
  data/                 Seed data used by the mock API
  features/             Feature modules organized by workflow
  i18n/                 Locale setup and translation dictionaries
  lib/                  Shared API, analytics, validation, and utility code
  store/                Redux Toolkit store and slices
  test/                 Test setup helpers
```

State is intentionally split:

- TanStack Query owns async server-like data: tasks, submissions, rubrics, dashboard metrics.
- Redux owns small client workflow state: sidebar state, keyboard-mode preference, active draft marker.
- React local state owns form interaction that should not be global.
- URL state owns navigation-level state such as active pages and task IDs.

## Accessibility

The interface is built with keyboard navigation, semantic headings, labeled controls, visible focus states, status messages, and right-to-left layout support. Automated checks are included as part of the Playwright accessibility smoke test folder.

See [`docs/accessibility.md`](docs/accessibility.md).

## Performance

The dashboard moves aggregation work into a Web Worker when available and falls back to a synchronous calculation only if worker creation fails. Large task lists are structured so virtualization can be added without changing the data contract.

See [`docs/performance.md`](docs/performance.md).

## Testing strategy

- Business rules are tested with Vitest.
- UI behavior is tested with Testing Library.
- Critical flows are tested with Playwright.
- Accessibility smoke checks run against primary pages.

See [`docs/testing-strategy.md`](docs/testing-strategy.md).

## Working with Codex

The root [`AGENTS.md`](AGENTS.md) file contains repository-level instructions for Codex. The file tells Codex how to run, test, structure, and review changes in this codebase.

Reusable task prompts are in [`docs/codex-task-prompts.md`](docs/codex-task-prompts.md).

## Project status

This repository is a working frontend workbench. The main flows, seed data, architecture docs, tests, CI, and performance notes are included. The next useful milestones are listed in [`docs/roadmap.md`](docs/roadmap.md).
