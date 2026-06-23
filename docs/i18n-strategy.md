# Internationalization strategy

EvalForge supports English, Spanish, and Arabic. Arabic is included to exercise right-to-left layout behavior.

## Rules

- Store user-facing UI strings in `src/i18n/resources.ts`.
- Use interpolation for dynamic values.
- Avoid building sentences by concatenating translated fragments.
- Verify date and number formatting with `Intl` APIs.
- Set document direction when the active language changes.
- Keep layout spacing logical where practical so RTL support does not require duplicated CSS.

## Adding a string

1. Add the key to all languages in `src/i18n/resources.ts`.
2. Use `t('namespace.key')` in the component.
3. Check the page in English, Spanish, and Arabic.
4. Add a test when the string is part of critical behavior.
