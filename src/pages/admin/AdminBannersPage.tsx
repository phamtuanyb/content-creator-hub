import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { logError, isValidHttpUrl } from '@/lib/errorLogger';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ExternalLink, GripVertical } from 'lucide-react';

interface ProgramBanner {
  id: string;
  image_url: string;
  link_url: string | null;
  title: string | null;
  status: string;
  order_index: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export function AdminBannersPage() {
  const [banners, setBanners] = useState<ProgramBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<ProgramBanner | null>(null);

  // Form state
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    // Admins need to see all banners, so we use a different approach
    const { data, error } = await supabase
      .from('program_banners')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast.error('Không thể tải danh sách banner');
      logError(error, 'fetchBanners');
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  }

  function resetForm() {
    setImageUrl('');
    setLinkUrl('');
    setTitle('');
    setIsActive(true);
    setStartDate('');
    setEndDate('');
    setEditingBanner(null);
  }

  function openEditDialog(banner: ProgramBanner) {
    setEditingBanner(banner);
    setImageUrl(banner.image_url);
    setLinkUrl(banner.link_url || '');
    setTitle(banner.title || '');
    setIsActive(banner.status === 'active');
    setStartDate(banner.start_date ? banner.start_date.split('T')[0] : '');
    setEndDate(banner.end_date ? banner.end_date.split('T')[0] : '');
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedImageUrl = imageUrl.trim();
    const trimmedLinkUrl = linkUrl.trim();
    const trimmedTitle = title.trim();

    // Validate image URL
    if (!trimmedImageUrl) {
      toast.error('Vui lòng nhập URL hình ảnh');
      return;
    }

    if (!isValidHttpUrl(trimmedImageUrl)) {
      toast.error('URL hình ảnh không hợp lệ. Vui lòng sử dụng URL bắt đầu bằng http:// hoặc https://');
      return;
    }

    // Validate link URL if provided
    if (trimmedLinkUrl && !isValidHttpUrl(trimmedLinkUrl)) {
      toast.error('URL liên kết không hợp lệ. Vui lòng sử dụng URL bắt đầu bằng http:// hoặc https://');
      return;
    }

    // Validate title length
    if (trimmedTitle && trimmedTitle.length > 200) {
      toast.error('Tiêu đề không được dài quá 200 ký tự');
      return;
    }

    // Validate URL lengths
    if (trimmedImageUrl.length > 2048) {
      toast.error('URL hình ảnh quá dài (tối đa 2048 ký tự)');
      return;
    }

    if (trimmedLinkUrl && trimmedLinkUrl.length > 2048) {
      toast.error('URL liên kết quá dài (tối đa 2048 ký tự)');
      return;
    }

    const bannerData = {
      image_url: trimmedImageUrl,
      link_url: trimmedLinkUrl || null,
      title: trimmedTitle || null,
      status: isActive ? 'active' : 'inactive',
      start_date: startDate || null,
      end_date: endDate || null,
      order_index: editingBanner ? editingBanner.order_index : banners.length,
    };

    if (editingBanner) {
      const { error } = await supabase
        .from('program_banners')
        .update(bannerData)
        .eq('id', editingBanner.id);

      if (error) {
        toast.error('Không thể cập nhật banner');
        logError(error, 'updateBanner');
      } else {
        toast.success('Đã cập nhật banner');
        setDialogOpen(false);
        resetForm();
        fetchBanners();
      }
    } else {
      const { error } = await supabase
        .from('program_banners')
        .insert(bannerData);

      if (error) {
        toast.error('Không thể thêm banner');
        logError(error, 'insertBanner');
      } else {
        toast.success('Đã thêm banner mới');
        setDialogOpen(false);
        resetForm();
        fetchBanners();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;

    const { error } = await supabase
      .from('program_banners')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Không thể xóa banner');
      logError(error, 'deleteBanner');
    } else {
      toast.success('Đã xóa banner');
      fetchBanners();
    }
  }

  async function toggleStatus(banner: ProgramBanner) {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('program_banners')
      .update({ status: newStatus })
      .eq('id', banner.id);

    if (error) {
      toast.error('Không thể cập nhật trạng thái');
      logError(error, 'toggleBannerStatus');
    } else {
      toast.success(`Banner đã ${newStatus === 'active' ? 'bật' : 'tắt'}`);
      fetchBanners();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Banner Chương trình</h1>
          <p className="text-muted-foreground">
            Quản lý banner hiển thị trên trang chủ
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề banner"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Hình ảnh *</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL Liên kết (tùy chọn)</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/page"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Kích hoạt banner</Label>
              </div>

              {imageUrl && (
                <div className="space-y-2">
                  <Label>Xem trước</Label>
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingBanner ? 'Cập nhật' : 'Thêm'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Banner</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : banners.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có banner nào. Nhấn "Thêm Banner" để bắt đầu.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-24">Hình ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Liên kết</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner, index) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div className="w-20 aspect-[16/9] rounded overflow-hidden bg-muted">
                        <img
                          src={banner.image_url}
                          alt={banner.title || 'Banner'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {banner.title || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      {banner.link_url ? (
                        <a
                          href={banner.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {banner.start_date && (
                          <div>Từ: {new Date(banner.start_date).toLocaleDateString('vi-VN')}</div>
                        )}
                        {banner.end_date && (
                          <div>Đến: {new Date(banner.end_date).toLocaleDateString('vi-VN')}</div>
                        )}
                        {!banner.start_date && !banner.end_date && (
                          <span className="text-muted-foreground">Không giới hạn</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={banner.status === 'active'}
                        onCheckedChange={() => toggleStatus(banner)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
