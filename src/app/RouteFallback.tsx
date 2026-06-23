import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';

export function RouteFallback() {
  const { t } = useTranslation();
  return <Card>{t('common.loadingPage')}</Card>;
}
