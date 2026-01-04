import { useState, useRef } from 'react';
import { useDataStore } from '@/lib/dataStore';
import { useVisibleData } from '@/hooks/useVisibleData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Pencil, Trash2, Upload, X, Image, Loader2 } from 'lucide-react';

export function AdminContentPage() {
  const { topics, software, getTopicById } = useDataStore();
  const { 
    getVisibleContents, 
    addContent: addContentToDb, 
    updateContent: updateContentInDb, 
    deleteContent: deleteContentFromDb,
    loading 
  } = useVisibleData();
  
  const contents = getVisibleContents();
  
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [deletingContentId, setDeletingContentId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    topicId: '',
    softwareId: '',
    status: true,
    imageUrl: '',
  });

  const [uploadedImages, setUploadedImages] = useState<{ url: string; description: string }[]>([]);

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      topicId: '',
      softwareId: '',
      status: true,
      imageUrl: '',
    });
    setUploadedImages([]);
    setEditingContentId(null);
  };

  const openEditDialog = (content: ReturnType<typeof getVisibleContents>[0]) => {
    setEditingContentId(content.id);
    if (content.imageUrl) {
      setUploadedImages([{ url: content.imageUrl, description: '' }]);
    } else {
      setUploadedImages([]);
    }
    
    setFormData({
      title: content.title,
      body: content.body,
      topicId: content.topicId || '',
      softwareId: content.softwareId || '',
      status: content.status === 'published',
      imageUrl: content.imageUrl || '',
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

  const handleSave = async (asDraft: boolean = false) => {
    if (!formData.title.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập tiêu đề nội dung', variant: 'destructive' });
      return;
    }
    if (!formData.body.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập nội dung', variant: 'destructive' });
      return;
    }

    const status = asDraft ? 'draft' : (formData.status ? 'published' : 'draft');
    
    setIsSaving(true);
    try {
      if (editingContentId) {
        await updateContentInDb(editingContentId, {
          title: formData.title,
          body: formData.body,
          topic_id: formData.topicId || undefined,
          software_id: formData.softwareId || undefined,
          status: status as 'draft' | 'published',
          image_url: uploadedImages[0]?.url || formData.imageUrl || undefined,
        });
        toast({ title: 'Đã cập nhật', description: 'Nội dung đã được cập nhật thành công' });
      } else {
        await addContentToDb({
          title: formData.title,
          body: formData.body,
          topic_id: formData.topicId || undefined,
          software_id: formData.softwareId || undefined,
          status: status as 'draft' | 'published',
          image_url: uploadedImages[0]?.url || undefined,
        });
        toast({ title: 'Đã tạo mới', description: 'Nội dung mới đã được thêm thành công' });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({ title: 'Lỗi', description: 'Không thể lưu nội dung', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deletingContentId) {
      try {
        await deleteContentFromDb(deletingContentId);
        toast({ title: 'Đã xóa', description: 'Nội dung đã được xóa khỏi hệ thống' });
      } catch (error) {
        console.error('Error deleting content:', error);
        toast({ title: 'Lỗi', description: 'Không thể xóa nội dung', variant: 'destructive' });
      }
      setDeletingContentId(null);
    }
  };

  const deletingContent = contents.find(c => c.id === deletingContentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                      <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                        {content.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(content.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(content)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingContentId(content.id)}>
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
            <DialogTitle>{editingContentId ? 'Sửa Nội dung' : 'Thêm Nội dung mới'}</DialogTitle>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Hủy
            </Button>
            <Button variant="outline" onClick={() => handleSave(true)} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Lưu bản nháp
            </Button>
            <Button onClick={() => handleSave(false)} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Đăng nội dung
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingContentId} onOpenChange={() => setDeletingContentId(null)}>
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
