import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, LogOut, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function WaitingRoomPage() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('activation_requests')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!error && data) {
        setHasExistingRequest(true);
      }
      setIsLoading(false);
    };

    checkExistingRequest();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleRequestActivation = async () => {
    if (!user || !profile) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('activation_requests')
      .insert({
        user_id: user.id,
        user_email: profile.email,
        status: 'sent'
      });
    
    setIsSubmitting(false);
    
    if (error) {
      if (error.code === '23505') {
        // Duplicate key error - request already exists
        setHasExistingRequest(true);
        toast({
          title: "Yêu cầu đã tồn tại",
          description: "Yêu cầu kích hoạt của bạn đang được xử lý.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể gửi yêu cầu. Vui lòng thử lại.",
        });
      }
      return;
    }
    
    setHasExistingRequest(true);
    toast({
      title: "Yêu cầu đã được gửi",
      description: "Vui lòng chờ Admin hoặc Lead xét duyệt.",
    });
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

        <div className="space-y-3 pt-4">
          {!isLoading && (
            hasExistingRequest ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Yêu cầu kích hoạt của bạn đang được xử lý.</span>
              </div>
            ) : (
              <Button 
                className="gap-2 w-full"
                onClick={handleRequestActivation}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu kích hoạt'}
              </Button>
            )
          )}
          
          <Button 
            variant="outline" 
            className="gap-2 w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}
