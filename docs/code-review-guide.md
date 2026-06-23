# Code review guide

Review code for product behavior first, then implementation details.

## Correctness

- Does the change satisfy the user workflow?
- Are edge cases handled: loading, empty, error, and success?
- Is state owned by the right layer?
- Are mutations followed by the right query invalidation?

## Accessibility

- Can the workflow be completed with keyboard only?
- Are form controls labeled?
- Is error text connected to fields?
- Are focus states visible?
- Does RTL layout still work?

## Maintainability

- Is business logic testable outside JSX?
- Are names specific enough to be understood later?
- Is duplicated logic removed or intentionally kept local?
- Are public utilities documented by tests or comments?

## Performance

- Does the change avoid expensive render-time calculations?
- Are large arrays kept out of Redux?
- Are expensive analytics isolated in pure functions or workers?

## Tests

- Are pure rules covered by unit tests?
- Are UI interactions covered by component or E2E tests?
- Did the author report the commands they actually ran?
