import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function WaitingRoomPage() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Tài khoản chưa được kích hoạt
          </h1>
          
          <p className="text-muted-foreground leading-relaxed">
            Tài khoản của bạn chưa được kích hoạt.
            <br /><br />
            Vui lòng liên hệ với <strong>Lead</strong> hoặc <strong>Admin</strong> để được kích hoạt quyền truy cập vào hệ thống kho content Viral MKT.
          </p>
        </div>

        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
