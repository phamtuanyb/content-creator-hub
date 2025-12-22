import { useState } from 'react';
import { useDataStore, Topic } from '@/lib/dataStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminTopicsPage() {
  const { topics, addTopic, updateTopic, deleteTopic } = useDataStore();
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    nameVi: '',
    description: '',
    status: true,
  });

  const resetForm = () => {
    setFormData({ name: '', nameVi: '', description: '', status: true });
    setEditingTopic(null);
  };

  const openEditDialog = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      nameVi: topic.nameVi,
      description: topic.description,
      status: topic.status === 'active',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.nameVi.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng điền đầy đủ tên chủ đề', variant: 'destructive' });
      return;
    }

    if (editingTopic) {
      updateTopic(editingTopic.id, {
        name: formData.name,
        nameVi: formData.nameVi,
        description: formData.description,
        status: formData.status ? 'active' : 'hidden',
      });
      toast({ title: 'Đã cập nhật', description: 'Chủ đề đã được cập nhật thành công' });
    } else {
      addTopic({
        name: formData.name,
        nameVi: formData.nameVi,
        description: formData.description,
        status: formData.status ? 'active' : 'hidden',
        icon: 'LayoutGrid',
        color: 'primary',
      });
      toast({ title: 'Đã tạo mới', description: 'Chủ đề mới đã được thêm thành công' });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingTopic) {
      deleteTopic(deletingTopic.id);
      toast({ title: 'Đã xóa', description: 'Chủ đề đã được xóa khỏi hệ thống' });
      setDeletingTopic(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Quản lý Chủ đề</h1>
          <p className="text-muted-foreground">Tạo và tổ chức các danh mục nội dung</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm Chủ đề
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTopic ? 'Sửa Chủ đề' : 'Thêm Chủ đề mới'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tên Chủ đề (Tiếng Anh)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Sales Content"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tên Chủ đề (Tiếng Việt)</Label>
                <Input
                  value={formData.nameVi}
                  onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                  placeholder="VD: Content Bán Hàng"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về chủ đề này..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                />
                <Label>Kích hoạt</Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleSave}>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Chủ đề</TableHead>
              <TableHead>Tên Tiếng Việt</TableHead>
              <TableHead>Số nội dung</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Chưa có chủ đề nào. Nhấn "Thêm Chủ đề" để bắt đầu.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.name}</TableCell>
                  <TableCell>{topic.nameVi}</TableCell>
                  <TableCell>{topic.contentCount}</TableCell>
                  <TableCell>
                    <Badge variant={topic.status === 'active' ? 'success' : 'secondary'}>
                      {topic.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(topic)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingTopic(topic)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingTopic} onOpenChange={() => setDeletingTopic(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Chủ đề</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa "{deletingTopic?.nameVi}"? Hành động này không thể hoàn tác.
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
