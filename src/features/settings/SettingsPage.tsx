import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { PageHeader } from '@/components/ui/PageHeader';
import { setKeyboardMode } from '@/store/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function SettingsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const keyboardMode = useAppSelector((state) => state.ui.keyboardMode);
  const keyboardModeId = 'keyboard-mode';

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} description={t('settings.description')} />

      <Card className="space-y-5">
        <LocaleSwitcher />
        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900">
          <input
            id={keyboardModeId}
            type="checkbox"
            className="mt-1 h-4 w-4 accent-blue-700"
            checked={keyboardMode}
            onChange={(event) => dispatch(setKeyboardMode(event.target.checked))}
          />
          <span>
            <label htmlFor={keyboardModeId} className="block">
              {t('settings.keyboardMode')}
            </label>
            <span className="block font-normal text-slate-600">
              {t('settings.keyboardModeHelp')}
            </span>
          </span>
        </div>
      </Card>
    </div>
  );
}
