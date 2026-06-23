# ADR 0002: State management split

## Status

Accepted

## Context

Use TanStack Query for server-like data and Redux Toolkit only for small client workflow preferences. This keeps async cache behavior out of global UI state and prevents large server datasets from becoming hard to invalidate.

## Decision

Adopt this approach as the default for new work. Changes should update this ADR or add a new one when the tradeoff changes.

## Consequences

- The codebase stays easier to reason about.
- The mocked frontend can evolve independently from backend decisions.
- Tests can focus on product behavior instead of infrastructure details.
