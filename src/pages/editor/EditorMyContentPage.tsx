import { useDataStore } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';
import { useVisibleData } from '@/hooks/useVisibleData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Pencil, Eye, Loader2 } from 'lucide-react';

export function EditorMyContentPage() {
  const { getTopicById } = useDataStore();
  const { getVisibleContents, isTopicVisible, loading } = useVisibleData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const allContents = getVisibleContents();
  
  // Filter content owned by current user (and exclude hidden-topic content for non-admin)
  const myContents = allContents.filter(c => c.ownerId === user?.id && isTopicVisible(c.topicId));

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
          <h1 className="text-2xl font-bold mb-1">My Content</h1>
          <p className="text-muted-foreground">Manage your created content</p>
        </div>
        
        <Button onClick={() => navigate('/editor/create')} className="gap-2">
          Create New
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
            {myContents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Bạn chưa tạo nội dung nào. Nhấn "Create New" để bắt đầu.
                </TableCell>
              </TableRow>
            ) : (
              myContents.map((content) => {
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/content/${content.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/editor/create?edit=${content.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
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
    </div>
  );
}
