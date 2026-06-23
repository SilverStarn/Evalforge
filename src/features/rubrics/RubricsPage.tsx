import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { mockApi } from '@/lib/api/mockApi';
import { rubricSchema } from '@/lib/rubrics/rubricSchema';

export function RubricsPage() {
  const { t } = useTranslation();
  const rubricsQuery = useQuery({ queryKey: ['rubrics'], queryFn: () => mockApi.getRubrics() });

  return (
    <div className="space-y-6">
      <PageHeader title={t('rubrics.title')} description={t('rubrics.description')} />

      {rubricsQuery.isLoading ? <Card>{t('rubrics.loading')}</Card> : null}
      {rubricsQuery.isError ? (
        <Card className="space-y-3">
          <p className="text-red-700">{t('rubrics.loadError')}</p>
          <Button type="button" variant="secondary" onClick={() => void rubricsQuery.refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : null}
      {rubricsQuery.data?.length === 0 ? <Card>{t('rubrics.empty')}</Card> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {rubricsQuery.data?.map((rubric) => {
          const validation = rubricSchema.safeParse(rubric);
          return (
            <Card key={rubric.id} className="space-y-4 border-t-4 border-t-blue-500">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{rubric.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{rubric.description}</p>
                </div>
                <span className="whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">
                  {t('rubrics.version')} {rubric.version}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase text-slate-500">
                  {t('rubrics.criteria')}
                </h3>
                <ul className="mt-3 space-y-3">
                  {rubric.criteria.map((criterion) => (
                    <li
                      key={criterion.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="font-semibold text-slate-950">{criterion.label}</p>
                      <p className="text-sm text-slate-600">{criterion.description}</p>
                      <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                        <div>
                          <dt className="font-semibold uppercase text-slate-500">
                            {t('rubrics.type')}
                          </dt>
                          <dd>{criterion.type}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase text-slate-500">
                            {t('rubrics.required')}
                          </dt>
                          <dd>{criterion.required ? t('common.yes') : t('common.no')}</dd>
                        </div>
                        {criterion.type === 'rating' ? (
                          <div>
                            <dt className="font-semibold uppercase text-slate-500">
                              {t('rubrics.range')}
                            </dt>
                            <dd>
                              {criterion.min} - {criterion.max}
                            </dd>
                          </div>
                        ) : null}
                        {criterion.options?.length ? (
                          <div className="sm:col-span-2">
                            <dt className="font-semibold uppercase text-slate-500">
                              {t('rubrics.options')}
                            </dt>
                            <dd>{criterion.options.join(', ')}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </li>
                  ))}
                </ul>
              </div>

              <p
                className={validation.success ? 'text-sm text-emerald-700' : 'text-sm text-red-700'}
              >
                {validation.success
                  ? t('rubrics.validationPassed')
                  : validation.error.issues[0]?.message}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
