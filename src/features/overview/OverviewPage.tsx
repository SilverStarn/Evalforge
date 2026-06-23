import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  GitPullRequestDraft,
  Languages,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';

const cards = [
  {
    to: '/review/t-1001',
    icon: ClipboardCheck,
    titleKey: 'overview.reviewTitle',
    textKey: 'overview.reviewText',
  },
  {
    to: '/lead-review',
    icon: GitPullRequestDraft,
    titleKey: 'overview.leadTitle',
    textKey: 'overview.leadText',
  },
  {
    to: '/dashboard',
    icon: BarChart3,
    titleKey: 'overview.analyticsTitle',
    textKey: 'overview.analyticsText',
  },
  {
    to: '/settings',
    icon: Languages,
    titleKey: 'overview.localizationTitle',
    textKey: 'overview.localizationText',
  },
];

export function OverviewPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-slate-950 p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase text-blue-200">EvalForge</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">{t('overview.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-200">{t('overview.intro')}</p>
        <Link
          to="/review/t-1001"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"
        >
          {t('overview.openSampleTask')} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.to} className="space-y-3">
              <Icon className="text-blue-700" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-slate-950">{t(card.titleKey)}</h2>
              <p className="text-sm leading-6 text-slate-600">{t(card.textKey)}</p>
              <Link
                to={card.to}
                className="inline-flex text-sm font-semibold text-blue-700 hover:underline"
              >
                {t('overview.open')}
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
