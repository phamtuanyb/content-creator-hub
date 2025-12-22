import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Phone, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useUserProfile } from '@/hooks/useUserProfile';

export function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const { profileSettings, loading, updateProfileSettings } = useUserProfile();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signatureText, setSignatureText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileSettings) {
      setFullName(profileSettings.full_name || '');
      setPhoneNumber(profileSettings.phone_number || '');
      setSignatureText(profileSettings.signature_text || '');
    }
  }, [profileSettings]);

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    // Basic Vietnamese phone format validation
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSave = async () => {
    // Validate phone number
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      toast({
        title: 'Lỗi',
        description: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const { error } = await updateProfileSettings({
      full_name: fullName || null,
      phone_number: phoneNumber || null,
      signature_text: signatureText || null,
    });
    setSaving(false);

    if (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu cài đặt. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Đã lưu!',
        description: 'Cài đặt hồ sơ đã được cập nhật thành công.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Cài đặt hồ sơ</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin cá nhân và chữ ký khi sao chép nội dung
          </p>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin hiển thị của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email không thể thay đổi
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hotline Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Số hotline
            </CardTitle>
            <CardDescription>
              Số điện thoại sẽ được tự động thêm vào cuối nội dung khi sao chép
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ví dụ: 0901234567"
              />
              <p className="text-xs text-muted-foreground">
                Format: 0xxxxxxxxx hoặc +84xxxxxxxxx
              </p>
            </div>

            {phoneNumber && (
              <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground mb-1">Xem trước:</p>
                <p className="font-medium">Liên hệ ngay hotline: {phoneNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Chữ ký
            </CardTitle>
            <CardDescription>
              Chữ ký sẽ được thêm vào cuối nội dung sau hotline khi sao chép
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signatureText">Nội dung chữ ký</Label>
              <Textarea
                id="signatureText"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                placeholder="Ví dụ:&#10;---&#10;Trân trọng,&#10;Công ty ABC&#10;Website: abc.com"
                rows={4}
              />
            </div>

            {signatureText && (
              <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground mb-1">Xem trước:</p>
                <p className="whitespace-pre-line">{signatureText}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Full Copy */}
        {(phoneNumber || signatureText) && (
          <Card>
            <CardHeader>
              <CardTitle>Xem trước nội dung khi sao chép</CardTitle>
              <CardDescription>
                Nội dung mẫu sẽ trông như thế này khi bạn sao chép
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4 text-sm whitespace-pre-line">
                <span className="text-muted-foreground">[Nội dung bài viết]</span>
                {phoneNumber && (
                  <>
                    {'\n\n'}Liên hệ ngay hotline: {phoneNumber}
                  </>
                )}
                {signatureText && (
                  <>
                    {'\n\n'}{signatureText}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </div>
      </div>
    </div>
  );
}
