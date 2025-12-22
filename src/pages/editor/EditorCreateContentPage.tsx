import { useState, useRef, useEffect } from 'react';
import { useDataStore, Content } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, Image, Send } from 'lucide-react';

const platforms = ['Facebook', 'Zalo', 'Group', 'Instagram', 'TikTok'];
const purposes = ['Giới thiệu', 'Chốt sale', 'Seeding', 'Chăm sóc', 'Khuyến mãi'];

export function EditorCreateContentPage() {
  const { topics, software, addContent, updateContent, getContentById, addImage, images, deleteImage } = useDataStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    hashtags: '',
    cta: '',
    topicId: '',
    softwareId: '',
    platforms: [] as string[],
    purpose: '',
    aiImagePrompt: '',
  });

  const [uploadedImages, setUploadedImages] = useState<{ url: string; description: string }[]>([]);

  useEffect(() => {
    if (editId) {
      const content = getContentById(editId);
      if (content && content.ownerId === user?.id) {
        const existingImages = images.filter(img => img.contentId === content.id);
        setUploadedImages(existingImages.map(img => ({ url: img.url, description: img.description || '' })));
        
        setFormData({
          title: content.title,
          body: content.body,
          hashtags: content.hashtags.join(', '),
          cta: content.cta,
          topicId: content.topicId,
          softwareId: content.softwareId || '',
          platforms: content.platforms,
          purpose: content.purpose,
          aiImagePrompt: content.aiImagePrompt || '',
        });
      }
    }
  }, [editId, getContentById, images, user?.id]);

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

  const updateImageDescription = (index: number, description: string) => {
    setUploadedImages(prev => prev.map((img, i) => 
      i === index ? { ...img, description } : img
    ));
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSave = (submitForApproval: boolean = false) => {
    if (!formData.title.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập tiêu đề nội dung', variant: 'destructive' });
      return;
    }
    if (!formData.body.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập nội dung', variant: 'destructive' });
      return;
    }
    if (!formData.topicId) {
      toast({ title: 'Lỗi', description: 'Vui lòng chọn chủ đề', variant: 'destructive' });
      return;
    }

    const hashtags = formData.hashtags.split(',').map(h => h.trim()).filter(Boolean);
    
    if (editId) {
      updateContent(editId, {
        title: formData.title,
        body: formData.body,
        hashtags,
        cta: formData.cta,
        topicId: formData.topicId,
        softwareId: formData.softwareId || undefined,
        platforms: formData.platforms,
        purpose: formData.purpose,
        aiImagePrompt: formData.aiImagePrompt,
        imageUrl: uploadedImages[0]?.url,
        imageDescription: uploadedImages[0]?.description,
        status: 'draft', // Editor can only save as draft
      });
      
      // Remove old images and add new ones
      const oldImages = images.filter(img => img.contentId === editId);
      oldImages.forEach(img => deleteImage(img.id));
      
      toast({ title: 'Đã cập nhật', description: submitForApproval ? 'Nội dung đã được gửi duyệt' : 'Nội dung đã được lưu' });
    } else {
      const contentId = String(Date.now());
      addContent({
        title: formData.title,
        body: formData.body,
        hashtags,
        cta: formData.cta,
        topicId: formData.topicId,
        softwareId: formData.softwareId || undefined,
        platforms: formData.platforms,
        purpose: formData.purpose,
        status: 'draft', // Editor always creates as draft
        aiImagePrompt: formData.aiImagePrompt,
        imageUrl: uploadedImages[0]?.url,
        imageDescription: uploadedImages[0]?.description,
        ownerId: user?.id, // Set owner
      });

      // Add uploaded images
      uploadedImages.forEach(img => {
        addImage({
          url: img.url,
          contentId: contentId,
          contentTitle: formData.title,
          description: img.description,
        });
      });

      toast({ title: 'Đã tạo mới', description: submitForApproval ? 'Nội dung đã được gửi duyệt' : 'Nội dung đã được lưu' });
    }

    navigate('/editor/my-content');
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
            
            <div className="space-y-2">
              <Label>Hashtags (phân cách bằng dấu phẩy)</Label>
              <Input
                value={formData.hashtags}
                onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                placeholder="#MKT, #Sales, #Marketing"
              />
            </div>
            
            <div className="space-y-2">
              <Label>CTA (Call to Action)</Label>
              <Input
                value={formData.cta}
                onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                placeholder="VD: Mua ngay →"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chủ đề *</Label>
              <Select value={formData.topicId} onValueChange={(v) => setFormData({ ...formData, topicId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map(t => (
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

            <div className="space-y-2">
              <Label>Nền tảng</Label>
              <div className="flex flex-wrap gap-3">
                {platforms.map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <Checkbox
                      id={p}
                      checked={formData.platforms.includes(p)}
                      onCheckedChange={() => togglePlatform(p)}
                    />
                    <label htmlFor={p} className="text-sm cursor-pointer">{p}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mục đích</Label>
              <Select value={formData.purpose || "none"} onValueChange={(v) => setFormData({ ...formData, purpose: v === "none" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mục đích" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn</SelectItem>
                  {purposes.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Image Prompt</Label>
              <Textarea
                value={formData.aiImagePrompt}
                onChange={(e) => setFormData({ ...formData, aiImagePrompt: e.target.value })}
                placeholder="Mô tả hình ảnh để AI tạo..."
                rows={3}
              />
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
                multiple
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
                      <Input
                        className="mt-2"
                        placeholder="Mô tả hình ảnh..."
                        value={img.description}
                        onChange={(e) => updateImageDescription(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => navigate('/editor/my-content')}>Hủy</Button>
          <Button variant="outline" onClick={() => handleSave(false)}>Lưu bản nháp</Button>
          <Button onClick={() => handleSave(true)} className="gap-2">
            <Send className="h-4 w-4" />
            Gửi duyệt
          </Button>
        </div>
      </div>
    </div>
  );
}
