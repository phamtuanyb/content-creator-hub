import { useState } from 'react';
import { useDataStore, Software } from '@/lib/dataStore';
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

export function AdminSoftwarePage() {
  const { software, addSoftware, updateSoftware, deleteSoftware } = useDataStore();
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);
  const [deletingSoftware, setDeletingSoftware] = useState<Software | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tag: '',
    status: true,
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', tag: '', status: true });
    setEditingSoftware(null);
  };

  const openEditDialog = (sw: Software) => {
    setEditingSoftware(sw);
    setFormData({
      name: sw.name,
      description: sw.description,
      tag: sw.tag,
      status: sw.status === 'active',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập tên phần mềm', variant: 'destructive' });
      return;
    }

    if (editingSoftware) {
      updateSoftware(editingSoftware.id, {
        name: formData.name,
        description: formData.description,
        tag: formData.tag,
        status: formData.status ? 'active' : 'hidden',
      });
      toast({ title: 'Đã cập nhật', description: 'Phần mềm đã được cập nhật thành công' });
    } else {
      addSoftware({
        name: formData.name,
        description: formData.description,
        tag: formData.tag,
        status: formData.status ? 'active' : 'hidden',
      });
      toast({ title: 'Đã thêm mới', description: 'Phần mềm mới đã được thêm thành công' });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingSoftware) {
      deleteSoftware(deletingSoftware.id);
      toast({ title: 'Đã xóa', description: 'Phần mềm đã được xóa khỏi hệ thống' });
      setDeletingSoftware(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Quản lý Phần mềm</h1>
          <p className="text-muted-foreground">Quản lý các sản phẩm phần mềm MKT để phân loại nội dung</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Thêm Phần mềm
        </Button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Phần mềm</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {software.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Chưa có phần mềm nào. Nhấn "Thêm Phần mềm" để bắt đầu.
                </TableCell>
              </TableRow>
            ) : (
              software.map((sw) => (
                <TableRow key={sw.id}>
                  <TableCell className="font-medium">{sw.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[300px] truncate">
                    {sw.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{sw.tag}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sw.status === 'active' ? 'success' : 'secondary'}>
                      {sw.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(sw)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingSoftware(sw)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSoftware ? 'Sửa Phần mềm' : 'Thêm Phần mềm mới'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên Phần mềm</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: MKT Care"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn về phần mềm..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tag</Label>
              <Input
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="VD: Marketing, Data, Chăm sóc"
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

      <AlertDialog open={!!deletingSoftware} onOpenChange={() => setDeletingSoftware(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Phần mềm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa "{deletingSoftware?.name}"? Hành động này không thể hoàn tác.
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
