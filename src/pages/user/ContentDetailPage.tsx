import { useParams, Link } from 'react-router-dom';
import { contents, topics, software } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Wand2, ArrowLeft, Calendar, Hash } from 'lucide-react';

export function ContentDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const content = contents.find(c => c.id === id);
  const topic = content ? topics.find(t => t.id === content.topicId) : null;
  const sw = content?.softwareId ? software.find(s => s.id === content.softwareId) : null;

  if (!content) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Content not found</h2>
      </div>
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link
        to={topic ? `/topic/${topic.id}` : '/'}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {topic?.name || 'Home'}
      </Link>

      {/* Header */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {topic && <Badge variant="primary">{topic.name}</Badge>}
          {sw && <Badge variant="info">{sw.name}</Badge>}
          <Badge variant={content.status === 'published' ? 'success' : 'secondary'}>
            {content.status}
          </Badge>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {content.createdAt}
          </div>
          <div className="flex items-center gap-1.5">
            <Copy className="h-4 w-4" />
            {content.copyCount} copies
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Content</h2>
          <Button onClick={() => handleCopy(content.body, 'Content')} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy Text
          </Button>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 whitespace-pre-line text-sm leading-relaxed">
          {content.body}
        </div>

        {content.cta && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">CTA:</span>
            <Badge variant="primary">{content.cta}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(content.cta, 'CTA')}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Hashtags */}
      {content.hashtags.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Hashtags</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.hashtags.join(' '), 'Hashtags')}
              className="gap-2"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy All
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleCopy(tag, 'Hashtag')}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* AI Image Prompt */}
      {content.aiImagePrompt && (
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">AI Image Prompt</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.aiImagePrompt!, 'AI Prompt')}
              className="gap-2"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Prompt
            </Button>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 text-sm italic text-muted-foreground">
            {content.aiImagePrompt}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="font-semibold mb-4">Details</h2>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Platforms</p>
            <div className="flex flex-wrap gap-1.5">
              {content.platforms.map((platform) => (
                <Badge key={platform} variant="secondary">{platform}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Purpose</p>
            <Badge variant="outline">{content.purpose}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
