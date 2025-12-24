import { useState } from 'react';
import { ContentCard } from '@/components/cards/ContentCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useVisibleData } from '@/hooks/useVisibleData';

export function SalesContentLibraryPage() {
  const { getVisiblePublishedContents } = useVisibleData();
  const [searchTerm, setSearchTerm] = useState('');

  const publishedContents = getVisiblePublishedContents();
  
  const filteredContents = publishedContents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Content Library</h1>
          <p className="text-muted-foreground">Browse and copy published content for sales</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredContents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Không tìm thấy nội dung nào.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </div>
  );
}
