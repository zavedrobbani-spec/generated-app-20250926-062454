import { NavLink } from 'react-router-dom';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' as keyof typeof Icons },
  { href: '/connectors', label: 'Connectors', icon: 'connectors' as keyof typeof Icons },
  { href: '/users', label: 'Users & Groups', icon: 'users' as keyof typeof Icons },
  { href: '/routing', label: 'Routing', icon: 'routing' as keyof typeof Icons },
  { href: '/filters', label: 'Filters', icon: 'filters' as keyof typeof Icons },
  { href: '/send-message', label: 'Send Message', icon: 'sendMessage' as keyof typeof Icons },
];
const settingsNav = { href: '/settings', label: 'Settings', icon: 'settings' as keyof typeof Icons };
interface SidebarProps {
  isSidebarOpen: boolean;
}
export function Sidebar({ isSidebarOpen }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-gray-900 text-gray-200 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0',
        isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64'
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-800 px-6">
        <Icons.logo className="h-8 w-8 text-primary" />
        <span className="text-xl font-semibold text-white">Jasmin Pulse</span>
      </div>
      <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <ul className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = Icons[item.icon];
            return (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={toggleTheme}
          >
            {isDark ? <Icons.sun className="h-5 w-5" /> : <Icons.moon className="h-5 w-5" />}
            <span>Toggle Theme</span>
          </Button>
          <NavLink
            to={settingsNav.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )
            }
          >
            <Icons.settings className="h-5 w-5" />
            {settingsNav.label}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}