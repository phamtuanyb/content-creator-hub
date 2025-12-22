import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore, Content } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Image as ImageIcon, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoginPromptModal } from '@/components/auth/LoginPromptModal';

interface ContentCardProps {
  content: Content;
  showTopic?: boolean;
  onEdit?: (content: Content) => void;
  onDelete?: (content: Content) => void;
  onPublish?: (content: Content) => void;
}

export function ContentCard({ content, showTopic = true, onEdit, onDelete, onPublish }: ContentCardProps) {
  const { toast } = useToast();
  const { getTopicById, incrementCopyCount, images } = useDataStore();
  const { role, user, canEditContent, canPublishContent } = useAuth();
  const { buildCopyText } = useUserProfile();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const topic = getTopicById(content.topicId);
  const isAuthenticated = !!user;
  
  // Check if content has images
  const contentImages = images.filter(img => img.contentId === content.id);
  const hasImage = contentImages.length > 0 || !!content.imageUrl;

  const handleCopy = (e: React.MouseEvent, withHotline: boolean = true) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    const textToCopy = withHotline ? buildCopyText(content.body) : content.body;
    navigator.clipboard.writeText(textToCopy);
    incrementCopyCount(content.id);
    
    toast({
      title: "Đã sao chép!",
      description: withHotline ? "Nội dung kèm hotline đã được sao chép" : "Nội dung đã được sao chép",
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
              {topic.nameVi}
            </Badge>
          )}
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
        </div>
        
        {hasImage && (
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
            {contentImages[0]?.url || content.imageUrl ? (
              <img 
                src={contentImages[0]?.url || content.imageUrl} 
                alt="" 
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            )}
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
        {content.purpose && (
          <Badge variant="outline" className="text-xs">
            {content.purpose}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Copy className="h-3.5 w-3.5" />
          <span>{content.copyCount} lượt sao chép</span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Copy with hotline - ALL roles (login required) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleCopy(e, true)}
                className="h-8 px-3 gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Sao chép
              </Button>
            </TooltipTrigger>
            {!isAuthenticated && (
              <TooltipContent>Đăng nhập để sử dụng</TooltipContent>
            )}
          </Tooltip>
          
          {/* Copy without hotline - ALL roles (login required) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleCopy(e, false)}
                className="h-8 px-2 text-muted-foreground"
                title="Sao chép không hotline"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            {!isAuthenticated && (
              <TooltipContent>Đăng nhập để sử dụng</TooltipContent>
            )}
          </Tooltip>
          
          {/* Edit - Admin OR (Editor AND owner) */}
          {canEditContent(content.ownerId || null) && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(content);
              }}
              className="h-8 px-2"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          
          {/* Delete - Admin ONLY */}
          {role === 'admin' && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(content);
              }}
              className="h-8 px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          
          {/* Publish - Admin ONLY */}
          {canPublishContent() && content.status === 'draft' && onPublish && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPublish(content);
              }}
              className="h-8 px-2 text-green-600 hover:text-green-600"
            >
              <CheckCircle className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      <LoginPromptModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </Link>
  );
}
