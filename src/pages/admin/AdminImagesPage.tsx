import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Trash2, RefreshCw, Image as ImageIcon, FileImage } from 'lucide-react';

interface MockImage {
  id: string;
  url: string;
  contentTitle: string;
  uploadedAt: string;
}

const mockImages: MockImage[] = [
  { id: '1', url: '/placeholder.svg', contentTitle: 'Flash Sale cuối tuần', uploadedAt: '2024-01-18' },
  { id: '2', url: '/placeholder.svg', contentTitle: 'Tips chăm sóc khách hàng', uploadedAt: '2024-01-22' },
  { id: '3', url: '/placeholder.svg', contentTitle: 'Motivation Monday', uploadedAt: '2024-01-25' },
  { id: '4', url: '/placeholder.svg', contentTitle: 'Case Study - Anh Minh', uploadedAt: '2024-01-20' },
];

export function AdminImagesPage() {
  const [images, setImages] = useState<MockImage[]>(mockImages);
  const [deletingImage, setDeletingImage] = useState<MockImage | null>(null);
  const { toast } = useToast();

  const handleDelete = () => {
    if (deletingImage) {
      setImages(images.filter(i => i.id !== deletingImage.id));
      toast({ title: 'Image deleted', description: 'Image has been removed' });
      setDeletingImage(null);
    }
  };

  const handleReplace = (id: string) => {
    toast({ title: 'Replace image', description: 'Image replacement feature coming soon' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Manage Images</h1>
          <p className="text-muted-foreground">View and manage content images</p>
        </div>
        
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Image
        </Button>
      </div>

      {images.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative rounded-xl bg-card border border-border overflow-hidden"
            >
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <FileImage className="h-12 w-12 text-muted-foreground/50" />
              </div>
              
              <div className="p-4">
                <p className="font-medium text-sm truncate mb-1">{image.contentTitle}</p>
                <p className="text-xs text-muted-foreground">{image.uploadedAt}</p>
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleReplace(image.id)}
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
          <h3 className="font-medium mb-1">No images uploaded</h3>
          <p className="text-sm text-muted-foreground">Upload images to attach to your content</p>
        </div>
      )}

      <AlertDialog open={!!deletingImage} onOpenChange={() => setDeletingImage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image from "{deletingImage?.contentTitle}"? This action cannot be undone.
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
