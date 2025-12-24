import { forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginPromptModal = forwardRef<HTMLDivElement, LoginPromptModalProps>(
  function LoginPromptModal({ open, onOpenChange }, ref) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
      onOpenChange(false);
      navigate('/auth', { state: { from: location, mode: 'login' } });
    };

    const handleRegister = () => {
      onOpenChange(false);
      navigate('/auth', { state: { from: location, mode: 'register' } });
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
            <DialogDescription>
              Vui lòng đăng nhập để sử dụng chức năng này
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleRegister} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Đăng ký
            </Button>
            <Button onClick={handleLogin} className="gap-2">
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
