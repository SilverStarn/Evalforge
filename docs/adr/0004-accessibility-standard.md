# ADR 0004: Accessibility standard

## Status

Accepted

## Context

Treat keyboard support, labels, focus states, and RTL checks as normal acceptance criteria. Automated smoke tests complement manual testing but do not replace it.

## Decision

Adopt this approach as the default for new work. Changes should update this ADR or add a new one when the tradeoff changes.

## Consequences

- The codebase stays easier to reason about.
- The mocked frontend can evolve independently from backend decisions.
- Tests can focus on product behavior instead of infrastructure details.
