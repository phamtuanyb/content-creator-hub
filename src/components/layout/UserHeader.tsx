import { Bell, Search, LogOut, Settings, User, FileText, Library, PenSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function UserHeader() {
  const { t } = useI18n();
  const { user, profile, role, signOut, canAccessAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-primary">MKT</span>
              <span className="text-foreground"> Viral Content</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/topics" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t('nav.topics')}
            </Link>
            <Link to="/community" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t('nav.community')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('common.search')} className="w-64 pl-9 bg-secondary/50 border-0 focus-visible:ring-1" />
          </div>
          
          <LanguageSwitcher />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile?.full_name || 'User'}</span>
                  <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Common items for all roles */}
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Cài đặt hồ sơ
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Role-specific items */}
              {canAccessAdmin() && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              
              {role === 'editor' && (
                <>
                  <DropdownMenuItem onClick={() => navigate('/editor/my-content')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Nội dung của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/editor/create')}>
                    <PenSquare className="mr-2 h-4 w-4" />
                    Tạo nội dung
                  </DropdownMenuItem>
                </>
              )}
              
              {role === 'sales' && (
                <DropdownMenuItem onClick={() => navigate('/sales/content')}>
                  <Library className="mr-2 h-4 w-4" />
                  Thư viện nội dung
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}