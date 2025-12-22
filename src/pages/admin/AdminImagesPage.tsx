import { useState, useRef } from 'react';
import { useDataStore, AppImage } from '@/lib/dataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus, Trash2, RefreshCw, Image as ImageIcon, FileImage, Upload } from 'lucide-react';

export function AdminImagesPage() {
  const { images, contents, addImage, updateImage, deleteImage } = useDataStore();
  const [deletingImage, setDeletingImage] = useState<AppImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replacingImage, setReplacingImage] = useState<AppImage | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    contentTitle: '',
    description: '',
    url: '',
  });

  const resetForm = () => {
    setFormData({ contentTitle: '', description: '', url: '' });
    setReplacingImage(null);
  };

  const handleDelete = () => {
    if (deletingImage) {
      deleteImage(deletingImage.id);
      toast({ title: 'Đã xóa', description: 'Hình ảnh đã được xóa khỏi hệ thống' });
      setDeletingImage(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server/storage here
      // For demo, we create a local object URL
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, url }));
    }
  };

  const handleSave = () => {
    if (!formData.contentTitle.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập tên nội dung liên quan', variant: 'destructive' });
      return;
    }

    if (replacingImage) {
      updateImage(replacingImage.id, {
        contentTitle: formData.contentTitle,
        description: formData.description,
        url: formData.url || replacingImage.url,
      });
      toast({ title: 'Đã cập nhật', description: 'Hình ảnh đã được cập nhật thành công' });
    } else {
      addImage({
        url: formData.url || '/placeholder.svg',
        contentTitle: formData.contentTitle,
        description: formData.description,
      });
      toast({ title: 'Đã thêm mới', description: 'Hình ảnh mới đã được thêm thành công' });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const openReplaceDialog = (image: AppImage) => {
    setReplacingImage(image);
    setFormData({
      contentTitle: image.contentTitle,
      description: image.description || '',
      url: image.url,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Quản lý Hình ảnh</h1>
          <p className="text-muted-foreground">Xem và quản lý hình ảnh nội dung</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Tải lên Hình ảnh
        </Button>
      </div>

      {images.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative rounded-xl bg-card border border-border overflow-hidden"
            >
              <div className="aspect-video bg-secondary flex items-center justify-center overflow-hidden">
                {image.url && image.url !== '/placeholder.svg' ? (
                  <img src={image.url} alt={image.contentTitle} className="w-full h-full object-cover" />
                ) : (
                  <FileImage className="h-12 w-12 text-muted-foreground/50" />
                )}
              </div>
              
              <div className="p-4">
                <p className="font-medium text-sm truncate mb-1">{image.contentTitle}</p>
                <p className="text-xs text-muted-foreground">{image.uploadedAt}</p>
                {image.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">{image.description}</p>
                )}
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openReplaceDialog(image)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDeletingImage(image)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-medium mb-1">Chưa có hình ảnh nào</h3>
          <p className="text-sm text-muted-foreground">Tải lên hình ảnh để đính kèm vào nội dung của bạn</p>
        </div>
      )}

      {/* Add/Replace Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{replacingImage ? 'Cập nhật Hình ảnh' : 'Tải lên Hình ảnh mới'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Chọn hình ảnh</Label>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.url && formData.url !== '/placeholder.svg' ? (
                  <img src={formData.url} alt="Preview" className="max-h-32 mx-auto rounded" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nhấn để chọn hình ảnh</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tên nội dung liên quan *</Label>
              <Input
                value={formData.contentTitle}
                onChange={(e) => setFormData({ ...formData, contentTitle: e.target.value })}
                placeholder="VD: Flash Sale cuối tuần"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Mô tả (tùy chọn)</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn về hình ảnh..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingImage} onOpenChange={() => setDeletingImage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Hình ảnh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hình ảnh từ "{deletingImage?.contentTitle}"? Hành động này không thể hoàn tác.
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
