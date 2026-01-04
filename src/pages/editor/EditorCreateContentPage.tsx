import { useState, useRef, useEffect } from 'react';
import { useDataStore } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';
import { useVisibleData } from '@/hooks/useVisibleData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, Image, Send, Loader2 } from 'lucide-react';

export function EditorCreateContentPage() {
  const { software } = useDataStore();
  const { getVisibleTopics, isTopicVisible, addContent, updateContent, getContentById } = useVisibleData();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    topicId: '',
    softwareId: '',
  });

  const [uploadedImages, setUploadedImages] = useState<{ url: string; description: string }[]>([]);

  useEffect(() => {
    if (editId) {
      const content = getContentById(editId);
      if (content && content.ownerId === user?.id) {
        // Non-admin users must not access content under hidden topics
        if (!isTopicVisible(content.topicId)) {
          navigate('/not-found', { replace: true });
          return;
        }

        if (content.imageUrl) {
          setUploadedImages([{ url: content.imageUrl, description: '' }]);
        }

        setFormData({
          title: content.title,
          body: content.body,
          topicId: content.topicId,
          softwareId: content.softwareId || '',
        });
      }
    }
  }, [editId, getContentById, user?.id, isTopicVisible, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages(prev => [...prev, { 
              url: event.target!.result as string, 
              description: '' 
            }]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (submitForApproval: boolean = false) => {
    if (!formData.title.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập tiêu đề nội dung', variant: 'destructive' });
      return;
    }
    if (!formData.body.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập nội dung', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      if (editId) {
        await updateContent(editId, {
          title: formData.title,
          body: formData.body,
          topic_id: formData.topicId || undefined,
          software_id: formData.softwareId || undefined,
          image_url: uploadedImages[0]?.url || undefined,
          status: 'draft', // Editor can only save as draft
        });
        
        toast({ title: 'Đã cập nhật', description: submitForApproval ? 'Nội dung đã được gửi duyệt' : 'Nội dung đã được lưu' });
      } else {
        await addContent({
          title: formData.title,
          body: formData.body,
          topic_id: formData.topicId || undefined,
          software_id: formData.softwareId || undefined,
          status: 'draft', // Editor always creates as draft
          image_url: uploadedImages[0]?.url || undefined,
          owner_id: user?.id,
        });

        toast({ title: 'Đã tạo mới', description: submitForApproval ? 'Nội dung đã được gửi duyệt' : 'Nội dung đã được lưu' });
      }

      navigate('/editor/my-content');
    } catch (error) {
      console.error('Error saving content:', error);
      toast({ title: 'Lỗi', description: 'Không thể lưu nội dung', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{editId ? 'Chỉnh sửa nội dung' : 'Tạo nội dung mới'}</h1>
        <p className="text-muted-foreground">Điền thông tin để tạo nội dung marketing</p>
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề nội dung *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Nội dung chính *</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Nhập nội dung..."
                rows={10}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chủ đề</Label>
              <Select value={formData.topicId || "none"} onValueChange={(v) => setFormData({ ...formData, topicId: v === "none" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn</SelectItem>
                  {getVisibleTopics().map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.nameVi}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Phần mềm (tùy chọn)</Label>
              <Select value={formData.softwareId || "none"} onValueChange={(v) => setFormData({ ...formData, softwareId: v === "none" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phần mềm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn</SelectItem>
                  {software.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Hình ảnh
              </Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                Tải lên hình ảnh
              </Button>
              
              {uploadedImages.length > 0 && (
                <div className="space-y-3 mt-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative border border-border rounded-lg p-2">
                      <div className="relative">
                        <img
                          src={img.url}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeUploadedImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => navigate('/editor/my-content')} disabled={isSaving}>
            Hủy
          </Button>
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Lưu bản nháp
          </Button>
          <Button onClick={() => handleSave(true)} className="gap-2" disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Send className="h-4 w-4" />
            Gửi duyệt
          </Button>
        </div>
      </div>
    </div>
  );
}
