import { useState } from 'react';
import { contents as initialContents, topics, software, Content } from '@/lib/mockData';
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
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';

const platforms = ['Facebook', 'Zalo', 'Group', 'Instagram', 'TikTok'];
const purposes = ['Giới thiệu', 'Chốt sale', 'Seeding', 'Chăm sóc', 'Khuyến mãi'];

export function AdminContentPage() {
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deletingContent, setDeletingContent] = useState<Content | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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
  });

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
    });
    setEditingContent(null);
  };

  const openEditDialog = (content: Content) => {
    setEditingContent(content);
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
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const hashtags = formData.hashtags.split(',').map(h => h.trim()).filter(Boolean);
    
    if (editingContent) {
      setContents(contents.map(c =>
        c.id === editingContent.id
          ? {
              ...c,
              ...formData,
              hashtags,
              softwareId: formData.softwareId || undefined,
              status: formData.status ? 'published' : 'draft',
            }
          : c
      ));
      toast({ title: 'Content updated', description: 'Changes saved successfully' });
    } else {
      const newContent: Content = {
        id: String(Date.now()),
        ...formData,
        hashtags,
        softwareId: formData.softwareId || undefined,
        status: formData.status ? 'published' : 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        copyCount: 0,
      };
      setContents([newContent, ...contents]);
      toast({ title: 'Content created', description: 'New content added successfully' });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingContent) {
      setContents(contents.filter(c => c.id !== deletingContent.id));
      toast({ title: 'Content deleted', description: 'Content has been removed' });
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
          <h1 className="text-2xl font-bold mb-1">Manage Content</h1>
          <p className="text-muted-foreground">Create and edit content templates</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => {
              const topic = topics.find(t => t.id === content.topicId);
              return (
                <TableRow key={content.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {content.title}
                  </TableCell>
                  <TableCell>{topic?.name || '-'}</TableCell>
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
                      {content.status}
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
            })}
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
            <DialogTitle>{editingContent ? 'Edit Content' : 'Add New Content'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Content Body</Label>
                <Textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Enter content body..."
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Hashtags (comma separated)</Label>
                <Input
                  value={formData.hashtags}
                  onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                  placeholder="#MKT, #Sales, #Marketing"
                />
              </div>
              
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={formData.cta}
                  onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                  placeholder="e.g., Mua ngay →"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select value={formData.topicId} onValueChange={(v) => setFormData({ ...formData, topicId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.nameVi}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Software (optional)</Label>
                <Select value={formData.softwareId} onValueChange={(v) => setFormData({ ...formData, softwareId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select software" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {software.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(p => (
                    <div key={p} className="flex items-center gap-2">
                      <Checkbox
                        id={p}
                        checked={formData.platforms.includes(p)}
                        onCheckedChange={() => togglePlatform(p)}
                      />
                      <label htmlFor={p} className="text-sm">{p}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select value={formData.purpose} onValueChange={(v) => setFormData({ ...formData, purpose: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
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
                  placeholder="Describe the image for AI generation..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                />
                <Label>Published</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={handleSave}>Save as Draft</Button>
            <Button onClick={handleSave}>Publish</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingContent} onOpenChange={() => setDeletingContent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingContent?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
