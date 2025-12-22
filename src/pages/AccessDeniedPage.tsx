import { useLocation, Link } from 'react-router-dom';
import { ShieldX, Lock, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

export function AccessDeniedPage() {
  const location = useLocation();
  const { t } = useI18n();
  const reason = location.state?.reason || 'role';

  const isLocked = reason === 'locked';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          {isLocked ? (
            <div className="p-4 bg-destructive/10 rounded-full">
              <Lock className="h-16 w-16 text-destructive" />
            </div>
          ) : (
            <div className="p-4 bg-warning/10 rounded-full">
              <ShieldX className="h-16 w-16 text-warning" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {isLocked ? 'Tài khoản bị khóa' : 'Truy cập bị từ chối'}
          </h1>
          <p className="text-muted-foreground">
            {isLocked 
              ? 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.'
              : 'Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Link to="/home">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
