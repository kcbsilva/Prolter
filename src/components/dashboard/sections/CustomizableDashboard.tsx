// src/components/dashboard/sections/CustomizableDashboard.tsx
'use client';

import * as React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Pencil, Check } from 'lucide-react';

import PlanPerformanceChart from '@/components/dashboard/charts/PlanPerformanceChart';
import AlertsTimeline from '@/components/dashboard/widgets/AlertsTimeline';
import TechnicianInsightsCard from '@/components/dashboard/widgets/TechnicianInsightsCard';
import TopSubscribersTable from '@/components/dashboard/widgets/TopSubscribersTable';
import ChurnRetentionChart from '@/components/dashboard/charts/ChurnRetentionChart';
import UpcomingPaymentsPanel from '@/components/dashboard/widgets/UpcomingPaymentsPanel';
import RealTimeNetworkMap from '@/components/dashboard/widgets/RealTimeNetworkMap';
import TotalSubscribersCard from '@/components/dashboard/widgets/TotalSubscribersCard';
import MRRCard from '@/components/dashboard/widgets/MRRCard';
import NetworkUptimeCard from '@/components/dashboard/widgets/NetworkUptimeCard';
import OpenTicketsCard from '@/components/dashboard/widgets/OpenTicketsCard';
import SubscriberGrowthChart from '@/components/dashboard/widgets/SubscriberGrowthChart';
import RecentActivityList from '@/components/dashboard/widgets/RecentActivityList';

const departments = ['commercial', 'financial', 'network', 'support', 'supervisor'] as const;
type Department = typeof departments[number];
type DashboardView = 'General' | 'Financial' | 'Network' | 'Technician' | 'Supervisor';

interface WidgetConfig {
  component: React.ReactNode;
  departments: Department[];
  label: string;
}

const widgetConfigs: Record<DashboardView, Record<string, WidgetConfig>> = {
  General: {
    planPerformance: { component: <PlanPerformanceChart />, departments: ['commercial', 'supervisor'], label: 'Plan Performance' },
    alerts: { component: <AlertsTimeline />, departments: ['network', 'support', 'supervisor'], label: 'Alerts Timeline' },
    technician: { component: <TechnicianInsightsCard />, departments: ['support', 'supervisor'], label: 'Technician Insights' },
    totalSubscribers: { component: <TotalSubscribersCard />, departments: ['commercial', 'supervisor'], label: 'Total Subscribers' },
    mrr: { component: <MRRCard />, departments: ['financial', 'supervisor'], label: 'MRR' },
    networkUptime: { component: <NetworkUptimeCard />, departments: ['network', 'supervisor'], label: 'Network Uptime' },
    openTickets: { component: <OpenTicketsCard />, departments: ['support', 'supervisor'], label: 'Open Tickets' },
    subscriberGrowth: { component: <SubscriberGrowthChart />, departments: ['commercial', 'supervisor'], label: 'Subscriber Growth' },
    recentActivity: { component: <RecentActivityList />, departments: ['supervisor'], label: 'Recent Activity' },
  },
  Financial: {
    topSubscribers: { component: <TopSubscribersTable />, departments: ['financial', 'supervisor'], label: 'Top Subscribers' },
    churnRetention: { component: <ChurnRetentionChart />, departments: ['financial', 'supervisor'], label: 'Churn & Retention' },
    upcomingPayments: { component: <UpcomingPaymentsPanel />, departments: ['financial', 'supervisor'], label: 'Upcoming Payments' },
  },
  Network: {
    realtimeMap: { component: <RealTimeNetworkMap />, departments: ['network', 'supervisor'], label: 'Real-Time Network Map' },
  },
  Technician: {},
  Supervisor: {},
};

const defaultLayouts: Record<DashboardView, Layout[]> = {
  General: [
    { i: 'planPerformance', x: 0, y: 0, w: 2, h: 2 },
    { i: 'alerts', x: 2, y: 0, w: 2, h: 2 },
    { i: 'technician', x: 4, y: 0, w: 2, h: 2 },
    { i: 'totalSubscribers', x: 0, y: 2, w: 2, h: 2 },
    { i: 'mrr', x: 2, y: 2, w: 2, h: 2 },
    { i: 'networkUptime', x: 4, y: 2, w: 2, h: 2 },
    { i: 'openTickets', x: 6, y: 2, w: 2, h: 2 },
    { i: 'subscriberGrowth', x: 0, y: 4, w: 4, h: 2 },
    { i: 'recentActivity', x: 4, y: 4, w: 4, h: 2 },
  ],
  Financial: [
    { i: 'topSubscribers', x: 0, y: 0, w: 4, h: 2 },
    { i: 'churnRetention', x: 4, y: 0, w: 4, h: 2 },
    { i: 'upcomingPayments', x: 0, y: 2, w: 8, h: 2 },
  ],
  Network: [
    { i: 'realtimeMap', x: 0, y: 0, w: 8, h: 4 },
  ],
  Technician: [],
  Supervisor: [],
};

// Utility function for safe localStorage parsing
function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

export default function CustomDashboardPage() {
  // Current user department - can be dynamic or from context
  const [currentDepartment] = React.useState<Department>('supervisor');

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const [currentView, setCurrentView] = React.useState<DashboardView>(() => {
    return safeParse<DashboardView>('dashboard-view', 'General');
  });

  const [layouts, setLayouts] = React.useState<Record<DashboardView, Layout[]>>(() => {
    return safeParse<Record<DashboardView, Layout[]>>('dashboard-layouts', defaultLayouts);
  });

  const [hidden, setHidden] = React.useState<Record<DashboardView, string[]>>(() => {
    return safeParse<Record<DashboardView, string[]>>(
      'dashboard-hidden',
      { General: [], Financial: [], Network: [], Technician: [], Supervisor: [] }
    );
  });

  const [isEditing, setIsEditing] = React.useState<boolean>(() => {
    return safeParse<boolean>('dashboard-editing', false);
  });

  const visibleWidgets = React.useMemo(() => {
    const viewWidgets = widgetConfigs[currentView] || {};
    const hiddenWidgets = hidden[currentView] || [];
    return Object.entries(viewWidgets).filter(([key, config]) =>
      config.departments.includes(currentDepartment) && !hiddenWidgets.includes(key)
    );
  }, [currentView, hidden, currentDepartment]);

  const hiddenWidgets = React.useMemo(() => hidden[currentView] || [], [hidden, currentView]);

  if (!hydrated) return <div className="p-4 text-muted-foreground">Loading dashboard...</div>;

  const handleLayoutChange = (newLayout: Layout[]) => {
    const updated = { ...layouts, [currentView]: newLayout };
    setLayouts(updated);
    localStorage.setItem('dashboard-layouts', JSON.stringify(updated));
  };

  const handleRemove = (key: string) => {
    const updated = { ...hidden, [currentView]: [...hiddenWidgets, key] };
    setHidden(updated);
    localStorage.setItem('dashboard-hidden', JSON.stringify(updated));
  };

  const handleRestore = (key: string) => {
    const updated = { ...hidden, [currentView]: hiddenWidgets.filter(k => k !== key) };
    setHidden(updated);
    localStorage.setItem('dashboard-hidden', JSON.stringify(updated));
  };

  const toggleEdit = () => {
    const updated = !isEditing;
    setIsEditing(updated);
    localStorage.setItem('dashboard-editing', JSON.stringify(updated));
  };

  const resetCurrentView = () => {
    const updatedLayouts = { ...layouts, [currentView]: defaultLayouts[currentView] || [] };
    setLayouts(updatedLayouts);
    localStorage.setItem('dashboard-layouts', JSON.stringify(updatedLayouts));

    const updatedHidden = { ...hidden, [currentView]: [] };
    setHidden(updatedHidden);
    localStorage.setItem('dashboard-hidden', JSON.stringify(updatedHidden));
  };

  return (
    <div className="p-4 w-full overflow-x-auto bg-background">
      <div className="mb-4 flex gap-4 min-w-[1200px] items-end bg-transparent">
        {/* Dashboard View Selector */}
        <div className="flex flex-col">
          <label htmlFor="dashboard-view-select" className="text-xs text-muted-foreground mb-1 select-none">
            Dashboard View
          </label>
          <select
            id="dashboard-view-select"
            value={currentView}
            onChange={(e) => {
              const newView = e.target.value as DashboardView;
              setCurrentView(newView);
              localStorage.setItem('dashboard-view', newView);
            }}
            className="px-3 py-2 text-sm border rounded h-[36px]"
          >
            {Object.keys(widgetConfigs).map(view => (
              <option key={view} value={view}>{view} Dashboard</option>
            ))}
          </select>
        </div>

        {/* Edit Toggle Button */}
        <button
          onClick={toggleEdit}
          className="h-[36px] px-3 py-1 rounded bg-primary text-white text-sm flex items-center gap-1"
          aria-pressed={isEditing}
          aria-label={isEditing ? 'Finish Editing Dashboard Layout' : 'Edit Dashboard Layout'}
          title={isEditing ? 'Finish Editing' : 'Edit Layout'}
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          <span>{isEditing ? 'Done' : 'Edit'}</span>
        </button>

        {/* Reset Button */}
        <button
          className="h-[36px] px-3 py-1 rounded border border-primary text-primary text-sm"
          onClick={() => {
            if (
              window.confirm(
                'Reset layout and restore all widgets for this dashboard view to default? This cannot be undone.'
              )
            ) resetCurrentView();
          }}
          title="Reset to Default Layout"
          aria-label="Reset dashboard layout and widgets to defaults"
        >
          Reset Layout
        </button>

        {/* Restore Hidden Widgets */}
        {hiddenWidgets.length > 0 && (
          <div className="flex gap-2 items-center text-sm overflow-x-auto max-w-[400px]">
            <span className="font-medium whitespace-nowrap">Restore Widgets:</span>
            {hiddenWidgets.map(key => {
              const label = widgetConfigs[currentView][key]?.label || key;
              return (
                <button
                  key={key}
                  onClick={() => handleRestore(key)}
                  className="px-2 py-1 bg-primary text-white rounded whitespace-nowrap"
                  aria-label={`Restore widget ${label}`}
                >
                  + {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <GridLayout
        className="layout"
        layout={(layouts[currentView] || []).filter(item =>
          visibleWidgets.some(([key]) => key === item.i)
        )}
        cols={8}
        rowHeight={100}
        width={1200}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        preventCollision={true}
        compactType={null}
        margin={[10, 10]}
        useCSSTransforms={true}
        draggableHandle=".drag-handle"
      >
        {visibleWidgets.map(([key, config]) => (
          <div
            key={key}
            className="rounded-md shadow relative bg-background flex flex-col"
            role="region"
            aria-label={config.label}
            tabIndex={0}
          >
            {isEditing && (
              <button
                onClick={() => handleRemove(key)}
                className="absolute top-1 right-1 z-10 text-xs bg-red-600 hover:bg-red-700 text-white rounded px-1"
                title={`Remove widget ${config.label}`}
                aria-label={`Remove widget ${config.label}`}
              >
                ✕
              </button>
            )}
            {isEditing && (
              <div
                className="drag-handle cursor-move absolute top-1 left-1 z-10 text-xs text-muted-foreground select-none"
                title="Drag handle"
              >
                ≡
              </div>
            )}
            {config.component}
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
