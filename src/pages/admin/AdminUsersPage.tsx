import { useState, useEffect } from 'react';
import { useAuth, AppRole } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Lock, 
  Unlock, 
  Key,
  Users,
  Loader2,
  Shield,
  UserCog,
  Eye
} from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  status: 'active' | 'locked';
  created_at: string;
  role: AppRole | null;
}

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'sales' as AppRole,
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          status: profile.status as 'active' | 'locked',
          created_at: profile.created_at,
          role: userRole?.role as AppRole | null,
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải danh sách người dùng',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateDialog = () => {
    setSelectedUser(null);
    setFormData({
      email: '',
      full_name: '',
      password: '',
      role: 'sales',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name || '',
      password: '',
      role: user.role || 'sales',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Vui lòng nhập email',
      });
      return;
    }

    setSaving(true);
    try {
      if (selectedUser) {
        // Update existing user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
          })
          .eq('id', selectedUser.id);

        if (profileError) throw profileError;

        // Update or insert role
        if (formData.role !== selectedUser.role) {
          // Delete old role if exists
          await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', selectedUser.id);

          // Insert new role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: selectedUser.id,
              role: formData.role,
            });

          if (roleError) throw roleError;
        }

        toast({
          title: 'Thành công',
          description: 'Đã cập nhật người dùng',
        });
      } else {
        // Create new user via admin API would require edge function
        // For now, we'll show a message that new users should register
        toast({
          variant: 'destructive',
          title: 'Thông báo',
          description: 'Người dùng mới cần đăng ký qua trang đăng ký. Sau đó admin có thể gán vai trò.',
        });
        setSaving(false);
        setIsDialogOpen(false);
        return;
      }

      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể lưu người dùng',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLock = async (user: UserWithRole) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: `Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản`,
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể thay đổi trạng thái tài khoản',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      // Delete role first
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.id);

      // Delete profile (this won't delete auth.users, only the profile)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã xóa người dùng',
      });
      
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa người dùng',
      });
    }
  };

  const getRoleBadge = (role: AppRole | null) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'editor':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><UserCog className="h-3 w-3 mr-1" />Editor</Badge>;
      case 'sales':
        return <Badge className="bg-green-500 hover:bg-green-600"><Eye className="h-3 w-3 mr-1" />Sales</Badge>;
      default:
        return <Badge variant="outline">Chưa gán</Badge>;
    }
  };

  const getStatusBadge = (status: 'active' | 'locked') => {
    if (status === 'locked') {
      return <Badge variant="destructive"><Lock className="h-3 w-3 mr-1" />Đã khóa</Badge>;
    }
    return <Badge variant="secondary"><Unlock className="h-3 w-3 mr-1" />Hoạt động</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Chưa có người dùng nào
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'Chưa đặt tên'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(user)}
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleLock(user)}
                          title={user.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                          disabled={user.id === currentUser?.id}
                        >
                          {user.status === 'locked' ? (
                            <Unlock className="h-4 w-4 text-green-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-orange-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                          title="Xóa"
                          disabled={user.id === currentUser?.id}
                        >
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
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? 'Cập nhật thông tin và vai trò của người dùng'
                : 'Người dùng mới cần đăng ký qua trang đăng ký'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!selectedUser}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as AppRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      Admin - Toàn quyền hệ thống
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-blue-500" />
                      Editor - Tạo và sửa nội dung
                    </div>
                  </SelectItem>
                  <SelectItem value="sales">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      Sales - Chỉ xem nội dung
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedUser ? 'Cập nhật' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.full_name || selectedUser?.email}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
