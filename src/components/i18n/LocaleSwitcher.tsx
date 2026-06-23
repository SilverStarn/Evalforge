import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const locales = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
] as const;

interface LocaleSwitcherProps {
  compactLabel?: boolean;
}

export function LocaleSwitcher({ compactLabel = false }: LocaleSwitcherProps) {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const locale = locales.find((item) => item.code === i18n.language) ?? locales[0];
    document.documentElement.lang = locale.code;
    document.documentElement.dir = locale.dir;
  }, [i18n.language]);

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <span className={compactLabel ? 'sr-only sm:not-sr-only' : undefined}>
        {t('settings.language')}
      </span>
      <select
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-[inset_0_1px_1px_rgb(15_23_42_/_0.04)]"
        value={i18n.language}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value);
        }}
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.label}
          </option>
        ))}
      </select>
    </label>
  );
}
