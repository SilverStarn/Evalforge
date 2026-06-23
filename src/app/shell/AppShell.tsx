import { Menu, X } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/uiSlice';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { Button } from '@/components/ui/Button';

const navItems = [
  { to: '/', key: 'nav.overview' },
  { to: '/tasks', key: 'nav.tasks' },
  { to: '/review/t-1001', key: 'nav.review' },
  { to: '/rubrics', key: 'nav.rubrics' },
  { to: '/lead-review', key: 'nav.leadReview' },
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/settings', key: 'nav.settings' },
];

export function AppShell() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <a href="#main-content" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
              aria-expanded={sidebarOpen}
              aria-controls="primary-navigation"
            >
              {sidebarOpen ? (
                <X aria-hidden="true" size={20} />
              ) : (
                <Menu aria-hidden="true" size={20} />
              )}
              <span className="sr-only">{t('nav.toggle')}</span>
            </Button>
            <div>
              <p className="text-sm font-semibold uppercase text-blue-700">EvalForge</p>
              <p className="text-xs text-slate-500">{t('app.tagline')}</p>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <nav
          id="primary-navigation"
          className={`${sidebarOpen ? 'block' : 'hidden'} rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:block`}
          aria-label={t('nav.primary')}
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main-content" className="min-w-0" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
