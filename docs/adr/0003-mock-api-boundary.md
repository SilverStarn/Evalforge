# ADR 0003: Mock API boundary

## Status

Accepted

## Context

Expose all data access through `src/lib/api/mockApi.ts`. Feature components should not import seed data directly. This keeps the future backend replacement small and testable.

## Decision

Adopt this approach as the default for new work. Changes should update this ADR or add a new one when the tradeoff changes.

## Consequences

- The codebase stays easier to reason about.
- The mocked frontend can evolve independently from backend decisions.
- Tests can focus on product behavior instead of infrastructure details.
