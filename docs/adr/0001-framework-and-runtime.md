# ADR 0001: Framework and runtime

## Status

Accepted

## Context

Use React with Vite and TypeScript for fast local development, static deployment, and strong type checking. The app remains backend-agnostic by using a mocked API boundary.

## Decision

Adopt this approach as the default for new work. Changes should update this ADR or add a new one when the tradeoff changes.

## Consequences

- The codebase stays easier to reason about.
- The mocked frontend can evolve independently from backend decisions.
- Tests can focus on product behavior instead of infrastructure details.
