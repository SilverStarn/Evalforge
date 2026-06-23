# Codex task prompts

Use these prompts from the Codex sidebar in VS Code. Start from a clean git status when possible.

## 1. Repository orientation

```text
Read README.md, AGENTS.md, docs/architecture.md, and the src directory. Summarize how the app is structured, where each workflow lives, how state is split, and which commands verify a change. Do not edit files.
```

## 2. Implement a review-workspace improvement

```text
Improve the review workspace so reviewers can add an inline annotation from selected text in either response panel. Keep the existing autosave behavior. Add keyboard support, accessible labels, and a Vitest or Testing Library test that verifies the annotation is added correctly. Run the smallest relevant tests, then run lint and build if dependencies are installed.
```

## 3. Add a rubric criterion type

```text
Add a new rubric criterion type called "severity_select" with options "low", "medium", and "high". Update TypeScript types, Zod validation, seeded data if useful, rubric preview UI, review form rendering, and tests. Keep user-facing labels localizable in src/i18n/resources.ts.
```

## 4. Strengthen accessibility

```text
Audit the task queue, review workspace, and lead-review page for keyboard and screen-reader issues. Fix semantic labels, focus states, heading order, field errors, and status messages. Add or update Playwright accessibility smoke tests for the changed pages. Do not add cosmetic-only changes.
```

## 5. Add dashboard metric

```text
Add a dashboard metric for average reviewer confidence by project. Implement the calculation as a pure function under src/lib/analytics, use it from the dashboard worker, render it in the dashboard UI, and add tests for the calculation. Keep fallback behavior working when Web Workers are unavailable.
```

## 6. Perform a code review

```text
Review the current diff against AGENTS.md and docs/code-review-guide.md. Look for correctness bugs, inaccessible interactions, unnecessary global state, missing tests, performance regressions, and unclear naming. Provide a prioritized list of findings. Do not edit files unless I ask for fixes.
```

## 7. Prepare a pull request

```text
Inspect the current branch and prepare a pull request summary. Include: what changed, why it changed, screenshots or manual verification notes if applicable, tests run, accessibility notes, performance notes, and follow-up items. Do not invent test results; only report commands that actually ran.
```

## 8. Refactor safely

```text
Refactor the selected feature to reduce duplication without changing behavior. First identify the repeated logic and propose the smallest safe extraction. Add or update tests before changing implementation when possible. After refactoring, run the relevant tests and summarize any risks.
```
