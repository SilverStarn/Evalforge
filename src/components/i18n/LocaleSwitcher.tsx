import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const locales = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
] as const;

export function LocaleSwitcher() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const locale = locales.find((item) => item.code === i18n.language) ?? locales[0];
    document.documentElement.lang = locale.code;
    document.documentElement.dir = locale.dir;
  }, [i18n.language]);

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <span>{t('settings.language')}</span>
      <select
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
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
