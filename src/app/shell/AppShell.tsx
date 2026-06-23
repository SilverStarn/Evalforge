import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  FileBadge2,
  Gauge,
  GitPullRequestDraft,
  Home,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/uiSlice';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { Button } from '@/components/ui/Button';

const navItems: Array<{ to: string; key: string; icon: LucideIcon }> = [
  { to: '/', key: 'nav.overview', icon: Home },
  { to: '/tasks', key: 'nav.tasks', icon: ClipboardList },
  { to: '/review/t-1001', key: 'nav.review', icon: ClipboardCheck },
  { to: '/rubrics', key: 'nav.rubrics', icon: FileBadge2 },
  { to: '/lead-review', key: 'nav.leadReview', icon: GitPullRequestDraft },
  { to: '/dashboard', key: 'nav.dashboard', icon: BarChart3 },
  { to: '/settings', key: 'nav.settings', icon: Settings },
];

export function AppShell() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen text-slate-950">
      <a href="#main-content" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-10 border-slate-200 bg-white px-0 lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
              aria-expanded={sidebarOpen}
              aria-controls="primary-navigation"
            >
              {sidebarOpen ? (
                <X aria-hidden="true" size={22} />
              ) : (
                <Menu aria-hidden="true" size={22} />
              )}
              <span className="sr-only">{t('nav.toggle')}</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
                <Gauge size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">EvalForge</p>
                <p className="hidden text-xs text-slate-500 sm:block">{t('app.tagline')}</p>
              </div>
            </div>
          </div>
          <LocaleSwitcher compactLabel />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <nav
          id="primary-navigation"
          className={`${sidebarOpen ? 'block' : 'hidden'} h-fit rounded-lg border border-slate-200/80 bg-white/90 p-2 shadow-[0_1px_2px_rgb(15_23_42_/_0.05)] backdrop-blur lg:block`}
          aria-label={t('nav.primary')}
        >
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-md border px-3 py-2.5 text-sm font-medium transition-[background-color,border-color,color,box-shadow] ${
                        isActive
                          ? 'border-blue-200 bg-blue-50 text-blue-800 shadow-[inset_3px_0_0_rgb(37_99_235)]'
                          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
                      }`
                    }
                  >
                    <Icon size={17} aria-hidden="true" className="shrink-0" />
                    <span>{t(item.key)}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-slate-200 px-3 py-3">
            <p className="text-xs font-medium text-slate-500">{t('app.tagline')}</p>
          </div>
        </nav>

        <main id="main-content" className="min-w-0 animate-enter" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
