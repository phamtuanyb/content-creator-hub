import { Link } from 'react-router-dom';
import { Content, topics } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentCardProps {
  content: Content;
  showTopic?: boolean;
}

export function ContentCard({ content, showTopic = true }: ContentCardProps) {
  const { toast } = useToast();
  const topic = topics.find(t => t.id === content.topicId);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(content.body);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  return (
    <Link
      to={`/content/${content.id}`}
      className="group relative overflow-hidden rounded-xl bg-card border border-border p-5 card-hover block"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          {showTopic && topic && (
            <Badge variant="primary" className="mb-2">
              {topic.name}
            </Badge>
          )}
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
        </div>
        
        {content.imageUrl && (
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 whitespace-pre-line">
        {content.body}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {content.platforms.map((platform) => (
          <Badge key={platform} variant="secondary" className="text-xs">
            {platform}
          </Badge>
        ))}
        <Badge variant="outline" className="text-xs">
          {content.purpose}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Copy className="h-3.5 w-3.5" />
          <span>{content.copyCount} copies</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-3 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
      </div>
    </Link>
  );
}
