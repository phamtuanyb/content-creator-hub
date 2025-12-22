import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
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
  Users,
  Shield,
  UserCog,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { t } = useI18n();
  const { role, profile, signOut } = useAuth();

  // Admin menu items - full access
  const adminMenuItems = [
    { icon: LayoutDashboard, label: t('admin.sidebar.dashboard'), path: '/admin' },
    { icon: Users, label: 'Người dùng', path: '/admin/users' },
    { icon: FolderTree, label: t('admin.sidebar.topics'), path: '/admin/topics' },
    { icon: FileText, label: t('admin.sidebar.content'), path: '/admin/content' },
    { icon: Image, label: t('admin.sidebar.images'), path: '/admin/images' },
    { icon: Boxes, label: t('admin.sidebar.software'), path: '/admin/software' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  // Editor menu items - limited access
  const editorMenuItems = [
    { icon: FileText, label: 'Nội dung của tôi', path: '/editor/my-content' },
    { icon: FileText, label: 'Tạo nội dung', path: '/editor/content' },
  ];

  // Determine which menu to show based on role
  const menuItems = role === 'admin' ? adminMenuItems : editorMenuItems;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'editor':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <UserCog className="h-3 w-3 mr-1" />
            Editor
          </Badge>
        );
      case 'sales':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <Eye className="h-3 w-3 mr-1" />
            Sales
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      <div className="p-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold">
            <span className="text-primary">MKT</span>
            <span className="text-foreground"> Admin</span>
          </span>
        </Link>
        {/* User info */}
        <div className="mt-3 p-2 rounded-lg bg-muted/50">
          <div className="text-sm font-medium truncate">
            {profile?.full_name || profile?.email || 'User'}
          </div>
          <div className="mt-1">{getRoleBadge()}</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path || 
            (item.path !== '/admin' && item.path !== '/editor' && currentPath.startsWith(item.path));
          
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
        <Link to="/home">
          <Button variant="outline" className="w-full justify-start gap-2">
            <ChevronLeft className="h-4 w-4" />
            {t('nav.home')}
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {t('admin.sidebar.logout')}
        </Button>
      </div>
    </aside>
  );
}
