import { useState } from 'react';
import { topics as initialTopics, Topic } from '@/lib/mockData';
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
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
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
    if (editingTopic) {
      setTopics(topics.map(t =>
        t.id === editingTopic.id
          ? { ...t, ...formData, status: formData.status ? 'active' : 'hidden' }
          : t
      ));
      toast({ title: 'Topic updated', description: 'Changes saved successfully' });
    } else {
      const newTopic: Topic = {
        id: String(Date.now()),
        ...formData,
        status: formData.status ? 'active' : 'hidden',
        icon: 'LayoutGrid',
        contentCount: 0,
        color: 'primary',
      };
      setTopics([...topics, newTopic]);
      toast({ title: 'Topic created', description: 'New topic added successfully' });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingTopic) {
      setTopics(topics.filter(t => t.id !== deletingTopic.id));
      toast({ title: 'Topic deleted', description: 'Topic has been removed' });
      setDeletingTopic(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Manage Topics</h1>
          <p className="text-muted-foreground">Create and organize content categories</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Topic Name (English)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sales Content"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Topic Name (Vietnamese)</Label>
                <Input
                  value={formData.nameVi}
                  onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                  placeholder="e.g., Content Bán Hàng"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this topic..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                />
                <Label>Active</Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic Name</TableHead>
              <TableHead>Vietnamese Name</TableHead>
              <TableHead>Contents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.name}</TableCell>
                <TableCell>{topic.nameVi}</TableCell>
                <TableCell>{topic.contentCount}</TableCell>
                <TableCell>
                  <Badge variant={topic.status === 'active' ? 'success' : 'secondary'}>
                    {topic.status}
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
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingTopic} onOpenChange={() => setDeletingTopic(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingTopic?.name}"? This action cannot be undone.
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
