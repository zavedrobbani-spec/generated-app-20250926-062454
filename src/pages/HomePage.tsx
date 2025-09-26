import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
const routeTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/connectors': 'Connectors',
  '/users': 'Users & Groups',
  '/routing': 'Routing',
  '/filters': 'Filters',
  '/send-message': 'Send Message',
  '/settings': 'Settings',
};
export function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? 'Jasmin Pulse';
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Icons.menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground lg:ml-0 ml-4">{title}</h1>
          {/* Future header items can go here */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}