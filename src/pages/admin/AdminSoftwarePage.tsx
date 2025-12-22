import { useState } from 'react';
import { software as initialSoftware, Software } from '@/lib/mockData';
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
  const [softwareList, setSoftwareList] = useState<Software[]>(initialSoftware);
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
    if (editingSoftware) {
      setSoftwareList(softwareList.map(s =>
        s.id === editingSoftware.id
          ? { ...s, ...formData, status: formData.status ? 'active' : 'hidden' }
          : s
      ));
      toast({ title: 'Software updated', description: 'Changes saved successfully' });
    } else {
      const newSoftware: Software = {
        id: String(Date.now()),
        ...formData,
        status: formData.status ? 'active' : 'hidden',
      };
      setSoftwareList([...softwareList, newSoftware]);
      toast({ title: 'Software added', description: 'New software added successfully' });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingSoftware) {
      setSoftwareList(softwareList.filter(s => s.id !== deletingSoftware.id));
      toast({ title: 'Software deleted', description: 'Software has been removed' });
      setDeletingSoftware(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Manage Software</h1>
          <p className="text-muted-foreground">Manage MKT software products for content categorization</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Software
        </Button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Software Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {softwareList.map((sw) => (
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
                    {sw.status}
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
            ))}
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
            <DialogTitle>{editingSoftware ? 'Edit Software' : 'Add New Software'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Software Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., MKT Care"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the software..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tag</Label>
              <Input
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g., Marketing, Data, Chăm sóc"
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

      <AlertDialog open={!!deletingSoftware} onOpenChange={() => setDeletingSoftware(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Software</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSoftware?.name}"? This action cannot be undone.
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
