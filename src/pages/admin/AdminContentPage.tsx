import { useState, useRef } from 'react';
import { useDataStore, Content } from '@/lib/dataStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload, X, Image } from 'lucide-react';

const platforms = ['Facebook', 'Zalo', 'Group', 'Instagram', 'TikTok'];
const purposes = ['Giới thiệu', 'Chốt sale', 'Seeding', 'Chăm sóc', 'Khuyến mãi'];

export function AdminContentPage() {
  const { contents, topics, software, addContent, updateContent, deleteContent, getTopicById, addImage, images, deleteImage } = useDataStore();
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deletingContent, setDeletingContent] = useState<Content | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
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
    status: true,
    aiImagePrompt: '',
    imageUrl: '',
    imageDescription: '',
  });

  const [uploadedImages, setUploadedImages] = useState<{ url: string; description: string }[]>([]);

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      hashtags: '',
      cta: '',
      topicId: '',
      softwareId: '',
      platforms: [],
      purpose: '',
      status: true,
      aiImagePrompt: '',
      imageUrl: '',
      imageDescription: '',
    });
    setUploadedImages([]);
    setEditingContent(null);
  };

  const openEditDialog = (content: Content) => {
    setEditingContent(content);
    // Load existing images for this content
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
      status: content.status === 'published',
      aiImagePrompt: content.aiImagePrompt || '',
      imageUrl: content.imageUrl || '',
      imageDescription: content.imageDescription || '',
    });
    setIsDialogOpen(true);
  };

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

  const handleSave = (asDraft: boolean = false) => {
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
    const status = asDraft ? 'draft' : (formData.status ? 'published' : 'draft');
    
    let contentId = editingContent?.id || '';
    
    if (editingContent) {
      updateContent(editingContent.id, {
        title: formData.title,
        body: formData.body,
        hashtags,
        cta: formData.cta,
        topicId: formData.topicId,
        softwareId: formData.softwareId || undefined,
        platforms: formData.platforms,
        purpose: formData.purpose,
        status,
        aiImagePrompt: formData.aiImagePrompt,
        imageUrl: uploadedImages[0]?.url || formData.imageUrl,
        imageDescription: uploadedImages[0]?.description || formData.imageDescription,
      });
      
      // Remove old images and add new ones
      const oldImages = images.filter(img => img.contentId === editingContent.id);
      oldImages.forEach(img => deleteImage(img.id));
      
      toast({ title: 'Đã cập nhật', description: 'Nội dung đã được cập nhật thành công' });
    } else {
      // For new content, we'll create the content first
      contentId = String(Date.now());
      addContent({
        title: formData.title,
        body: formData.body,
        hashtags,
        cta: formData.cta,
        topicId: formData.topicId,
        softwareId: formData.softwareId || undefined,
        platforms: formData.platforms,
        purpose: formData.purpose,
        status,
        aiImagePrompt: formData.aiImagePrompt,
        imageUrl: uploadedImages[0]?.url,
        imageDescription: uploadedImages[0]?.description,
      });
      toast({ title: 'Đã tạo mới', description: 'Nội dung mới đã được thêm thành công' });
    }

    // Add uploaded images to store
    uploadedImages.forEach(img => {
      addImage({
        url: img.url,
        contentId: editingContent?.id || contentId,
        contentTitle: formData.title,
        description: img.description,
      });
    });

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingContent) {
      deleteContent(deletingContent.id);
      toast({ title: 'Đã xóa', description: 'Nội dung đã được xóa khỏi hệ thống' });
      setDeletingContent(null);
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Quản lý Nội dung</h1>
          <p className="text-muted-foreground">Tạo và chỉnh sửa các mẫu nội dung</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Thêm Nội dung
        </Button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Chủ đề</TableHead>
              <TableHead>Nền tảng</TableHead>
              <TableHead>Mục đích</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Chưa có nội dung nào. Nhấn "Thêm Nội dung" để bắt đầu.
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content) => {
                const topic = getTopicById(content.topicId);
                return (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {content.title}
                    </TableCell>
                    <TableCell>{topic?.nameVi || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {content.platforms.slice(0, 2).map(p => (
                          <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                        {content.platforms.length > 2 && (
                          <Badge variant="secondary" className="text-xs">+{content.platforms.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{content.purpose}</TableCell>
                    <TableCell>
                      <Badge variant={content.status === 'published' ? 'success' : 'secondary'}>
                        {content.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{content.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(content)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingContent(content)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingContent ? 'Sửa Nội dung' : 'Thêm Nội dung mới'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-4">
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

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                />
                <Label>Đăng công khai</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button variant="outline" onClick={() => handleSave(true)}>Lưu bản nháp</Button>
            <Button onClick={() => handleSave(false)}>Đăng nội dung</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingContent} onOpenChange={() => setDeletingContent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Nội dung</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa "{deletingContent?.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
