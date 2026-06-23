import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { RouteFallback } from './RouteFallback';

const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);
const LeadReviewPage = lazy(() =>
  import('@/features/leadReview/LeadReviewPage').then((module) => ({
    default: module.LeadReviewPage,
  })),
);
const OverviewPage = lazy(() =>
  import('@/features/overview/OverviewPage').then((module) => ({ default: module.OverviewPage })),
);
const ReviewPage = lazy(() =>
  import('@/features/review/ReviewPage').then((module) => ({ default: module.ReviewPage })),
);
const RubricsPage = lazy(() =>
  import('@/features/rubrics/RubricsPage').then((module) => ({ default: module.RubricsPage })),
);
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const TaskQueuePage = lazy(() =>
  import('@/features/tasks/TaskQueuePage').then((module) => ({ default: module.TaskQueuePage })),
);

function routeElement(children: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: routeElement(<OverviewPage />) },
      { path: 'tasks', element: routeElement(<TaskQueuePage />) },
      { path: 'review/:taskId', element: routeElement(<ReviewPage />) },
      { path: 'rubrics', element: routeElement(<RubricsPage />) },
      { path: 'lead-review', element: routeElement(<LeadReviewPage />) },
      { path: 'dashboard', element: routeElement(<DashboardPage />) },
      { path: 'settings', element: routeElement(<SettingsPage />) },
    ],
  },
]);
