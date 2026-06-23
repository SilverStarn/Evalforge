# Performance notes

## Targets

- Keep review typing and scoring interactions responsive.
- Avoid running heavy dashboard calculations during render.
- Keep data transformation logic reusable and testable.
- Add performance checks before increasing dashboard data volume.

## Current approach

The dashboard sends seeded tasks and submissions to a Web Worker. The worker calculates throughput, agreement, rejection rate, average task time, and project breakdown. If the worker fails to initialize, the dashboard falls back to the same pure calculation function on the main thread.

Dashboard CSV export is generated from the already-computed metrics object through a pure formatter. It does not re-run aggregation or add chart/export dependencies.

The task queue keeps filter and search state in the URL and defers the query value used for server-like fetching, so typing in the search box stays responsive while the mocked API simulates latency.

Feature pages are loaded with route-level dynamic imports. The app shell and navigation stay in the initial bundle, while review, queue, rubric, lead-review, dashboard, and settings code loads on demand.

## Optimization patterns

- Use TanStack Query caching for server-like data.
- Use `useMemo` for expensive derived filters, not for every value.
- Keep large arrays out of Redux.
- Add virtualization before rendering large queues. The current seed dataset is small enough that a normal semantic table is simpler and more accessible.
- Dynamically import heavy visualizations when chart complexity grows.

## Performance review checklist

- Does the change recompute derived data on every keystroke?
- Does the change add a large dependency for a small UI need?
- Does the change put server data into global client state?
- Does the change block review interactions while dashboard data loads?
- Does the change create unnecessary re-renders across the app shell?
