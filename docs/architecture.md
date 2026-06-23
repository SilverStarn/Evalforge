# Architecture

EvalForge is a React single-page app with a mocked API layer. The application is organized by workflow so that review, rubric, task queue, lead review, and analytics logic can evolve independently.

## Goals

- Keep review interactions fast and reliable.
- Make scoring rules testable outside the UI.
- Keep global state small.
- Make accessibility and localization part of normal development.
- Keep the app deployable as a static frontend while backend services are still simulated.

## State ownership

| State                        | Owner                | Examples                                                |
| ---------------------------- | -------------------- | ------------------------------------------------------- |
| Server-like data             | TanStack Query       | Tasks, submissions, rubrics, dashboard summaries        |
| Shared client workflow state | Redux Toolkit        | Sidebar state, keyboard mode, active draft marker       |
| Component interaction state  | React local state    | Form field values, selected annotation text, open menus |
| Navigation state             | React Router         | Active route, task ID                                   |
| Persisted draft state        | localStorage wrapper | Incomplete review form values                           |

## Data flow

```text
Page route
  -> Feature component
    -> TanStack Query hook
      -> mockApi function
        -> seeded data module
    -> UI components
    -> Mutation hooks
      -> mockApi mutation
      -> query invalidation
```

## Feature boundaries

- `features/review`: task comparison, rubric scoring, annotations, autosave, submission.
- `features/tasks`: queue filtering, status changes, bulk-ready table behavior.
- `features/rubrics`: schema preview and rubric validation.
- `features/lead-review`: disagreement review and resolution timeline.
- `features/dashboard`: charts, metric cards, worker-backed analytics.

Shared code belongs in `src/lib` only when at least two features use it or when it is pure business logic worth testing in isolation.

## Error handling

User-facing workflows should expose clear recovery paths:

- Saving review fails: keep the draft locally and offer retry.
- Task not found: provide a link back to the queue.
- Empty queue: explain that no tasks match the current filters.
- Worker fails: fall back to synchronous metrics calculation.

## Accessibility baseline

- All primary navigation is keyboard reachable.
- Forms use visible labels and connected error text.
- Dialog-like panels manage focus before release.
- Status updates use polite live regions where useful.
- RTL locale testing is part of normal UI review.

## Performance baseline

- Avoid recomputing analytics in render.
- Use memoization for derived task filters and scoring summaries.
- Keep large calculations in pure functions and worker-safe modules.
- Avoid putting large server datasets into Redux.
