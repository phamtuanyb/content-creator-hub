import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import {
  LayoutDashboard,
  FolderTree,
  FileText,
  Image,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useI18n();

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.sidebar.dashboard'), path: '/admin' },
    { icon: FolderTree, label: t('admin.sidebar.topics'), path: '/admin/topics' },
    { icon: FileText, label: t('admin.sidebar.content'), path: '/admin/content' },
    { icon: Image, label: t('admin.sidebar.images'), path: '/admin/images' },
    { icon: Boxes, label: t('admin.sidebar.software'), path: '/admin/software' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      <div className="p-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold">
            <span className="text-primary">MKT</span>
            <span className="text-foreground"> Admin</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path || 
            (item.path !== '/admin' && currentPath.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <div className="flex justify-center mb-2">
          <LanguageSwitcher />
        </div>
        <Link to="/">
          <Button variant="outline" className="w-full justify-start gap-2">
            <ChevronLeft className="h-4 w-4" />
            {t('nav.home')}
          </Button>
        </Link>
        <Link to="/admin/login">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            {t('admin.sidebar.logout')}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
