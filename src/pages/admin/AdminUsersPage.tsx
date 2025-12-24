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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Lock, 
  Unlock, 
  Users,
  Loader2,
  Shield,
  UserCog,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  status: 'pending' | 'active' | 'locked';
  created_at: string;
  role: AppRole | null;
}

interface ActivationRequest {
  id: string;
  user_id: string;
  user_email: string;
  created_at: string;
  status: string;
  user_name?: string;
}

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [activationRequests, setActivationRequests] = useState<ActivationRequest[]>([]);
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
          status: profile.status as 'pending' | 'active' | 'locked',
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

  const fetchActivationRequests = async () => {
    try {
      const { data: requests, error } = await supabase
        .from('activation_requests')
        .select('*')
        .eq('status', 'sent')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user names for requests
      const userIds = requests?.map(r => r.user_id) || [];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const requestsWithNames = (requests || []).map(req => ({
          ...req,
          user_name: profiles?.find(p => p.id === req.user_id)?.full_name || null
        }));

        setActivationRequests(requestsWithNames);
      } else {
        setActivationRequests([]);
      }
    } catch (error) {
      console.error('Error fetching activation requests:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchActivationRequests();
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

  const handleActivateUser = async (userId: string) => {
    try {
      // Update profile status to active
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update activation request status
      const { error: requestError } = await supabase
        .from('activation_requests')
        .update({ 
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: currentUser?.id
        })
        .eq('user_id', userId);

      if (requestError) throw requestError;

      toast({
        title: 'Thành công',
        description: 'Đã kích hoạt tài khoản người dùng',
      });
      
      fetchUsers();
      fetchActivationRequests();
    } catch (error) {
      console.error('Error activating user:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể kích hoạt tài khoản',
      });
    }
  };

  const handleRejectRequest = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('activation_requests')
        .update({ 
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: currentUser?.id
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Đã từ chối',
        description: 'Đã từ chối yêu cầu kích hoạt',
      });
      
      fetchActivationRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể từ chối yêu cầu',
      });
    }
  };

  const handleToggleStatus = async (user: UserWithRole) => {
    let newStatus: 'pending' | 'active' | 'locked';
    
    if (user.status === 'active') {
      newStatus = 'locked';
    } else if (user.status === 'locked') {
      newStatus = 'active';
    } else {
      // pending -> active
      newStatus = 'active';
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', user.id);

      if (error) throw error;

      // If activating a pending user, update their activation request too
      if (user.status === 'pending' && newStatus === 'active') {
        await supabase
          .from('activation_requests')
          .update({ 
            status: 'approved',
            processed_at: new Date().toISOString(),
            processed_by: currentUser?.id
          })
          .eq('user_id', user.id);
      }

      const statusMessages = {
        active: 'kích hoạt',
        locked: 'khóa',
        pending: 'chuyển về chờ duyệt'
      };

      toast({
        title: 'Thành công',
        description: `Đã ${statusMessages[newStatus]} tài khoản`,
      });
      
      fetchUsers();
      fetchActivationRequests();
    } catch (error) {
      console.error('Error toggling status:', error);
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
      // Delete activation request if exists
      await supabase
        .from('activation_requests')
        .delete()
        .eq('user_id', selectedUser.id);

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
      fetchActivationRequests();
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

  const getStatusBadge = (status: 'pending' | 'active' | 'locked') => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-600"><Clock className="h-3 w-3 mr-1" />Chờ duyệt</Badge>;
      case 'locked':
        return <Badge variant="destructive"><Lock className="h-3 w-3 mr-1" />Đã khóa</Badge>;
      default:
        return <Badge variant="secondary"><Unlock className="h-3 w-3 mr-1" />Hoạt động</Badge>;
    }
  };

  const getStatusAction = (user: UserWithRole) => {
    if (user.status === 'pending') {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleToggleStatus(user)}
          title="Kích hoạt tài khoản"
          disabled={user.id === currentUser?.id}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      );
    }
    
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToggleStatus(user)}
        title={user.status === 'locked' ? 'Mở khóa' : 'Khóa'}
        disabled={user.id === currentUser?.id}
      >
        {user.status === 'locked' ? (
          <Unlock className="h-4 w-4 text-green-600" />
        ) : (
          <Lock className="h-4 w-4 text-orange-600" />
        )}
      </Button>
    );
  };

  const pendingRequestsCount = activationRequests.length;

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

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Yêu cầu kích hoạt
            {pendingRequestsCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
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
                            {getStatusAction(user)}
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
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activationRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      Không có yêu cầu kích hoạt nào
                    </TableCell>
                  </TableRow>
                ) : (
                  activationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.user_name || 'Chưa đặt tên'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.user_email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(request.created_at).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleActivateUser(request.user_id)}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Kích hoạt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectRequest(request.user_id)}
                            className="gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Từ chối
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

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
