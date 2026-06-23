import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { setKeyboardMode } from '@/store/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function SettingsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const keyboardMode = useAppSelector((state) => state.ui.keyboardMode);
  const keyboardModeId = 'keyboard-mode';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">{t('settings.title')}</h1>
        <p className="mt-2 text-slate-600">{t('settings.description')}</p>
      </div>

      <Card className="space-y-5">
        <LocaleSwitcher />
        <div className="flex items-start gap-3 text-sm font-medium text-slate-900">
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
