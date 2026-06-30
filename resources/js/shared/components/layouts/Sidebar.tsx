import { ReactNode } from 'react';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-64px)] w-64 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-700 shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:sticky`}
    >
      <nav className="h-full overflow-y-auto p-4">
        {/* Placeholder for navigation items */}
        <div className="space-y-2">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </nav>
    </aside>
  );
}
