import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore, Content } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Image as ImageIcon, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoginPromptModal } from '@/components/auth/LoginPromptModal';

interface PremiumContentCardProps {
  content: Content;
  variant?: 'default' | 'featured' | 'compact';
  showTopic?: boolean;
  className?: string;
}

export function PremiumContentCard({ 
  content, 
  variant = 'default',
  showTopic = true,
  className = ''
}: PremiumContentCardProps) {
  const { toast } = useToast();
  const { getTopicById, incrementCopyCount, images } = useDataStore();
  const { user } = useAuth();
  const { buildCopyText } = useUserProfile();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const topic = getTopicById(content.topicId);
  const isAuthenticated = !!user;
  
  const contentImages = images.filter(img => img.contentId === content.id);
  const hasImage = contentImages.length > 0 || !!content.imageUrl;
  const imageUrl = contentImages[0]?.url || content.imageUrl;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    const textToCopy = buildCopyText(content.body);
    navigator.clipboard.writeText(textToCopy);
    incrementCopyCount(content.id);
    
    toast({
      title: "Đã sao chép!",
      description: "Nội dung kèm hotline đã được sao chép",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (variant === 'featured') {
    return (
      <>
        <Link
          to={`/content/${content.id}`}
          className={`group relative block overflow-hidden rounded-3xl ${className}`}
        >
          {/* Background Image */}
          <div className="relative h-[400px] lg:h-[500px] w-full">
            {hasImage ? (
              <img 
                src={imageUrl} 
                alt={content.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="max-w-3xl">
              {/* Badge */}
              {showTopic && topic && (
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                  {topic.nameVi}
                </Badge>
              )}
              
              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {content.title}
              </h2>
              
              {/* Description */}
              <p className="text-muted-foreground text-lg mb-6 line-clamp-2">
                {content.body}
              </p>
              
              {/* Meta & CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {formatDate(content.createdAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    {content.copyCount} lượt sao chép
                  </div>
                </div>
                
                <Button 
                  className="gap-2 bg-primary/90 hover:bg-primary backdrop-blur-sm group/btn"
                  onClick={handleCopy}
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
        <LoginPromptModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <Link
          to={`/content/${content.id}`}
          className={`group flex gap-4 p-3 rounded-xl glass-strong hover:bg-accent/50 transition-all duration-300 ${className}`}
        >
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/50">
            {hasImage ? (
              <img 
                src={imageUrl} 
                alt={content.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {content.title}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>{content.copyCount}</span>
            </div>
          </div>
        </Link>
        <LoginPromptModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </>
    );
  }

  // Default variant
  return (
    <>
      <Link
        to={`/content/${content.id}`}
        className={`group article-card glass-strong block ${className}`}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          {hasImage ? (
            <img 
              src={imageUrl} 
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 image-overlay opacity-60" />
          
          {/* Topic badge */}
          {showTopic && topic && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/40 text-white border-white/20 backdrop-blur-md">
                {topic.nameVi}
              </Badge>
            </div>
          )}
          
          {/* Copy button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 bg-black/40 hover:bg-black/60 text-white border-white/20 backdrop-blur-md"
            >
              <Copy className="h-3.5 w-3.5" />
              Sao chép
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {content.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {content.body}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(content.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              {content.copyCount} lượt
            </div>
          </div>
        </div>
      </Link>
      <LoginPromptModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
}
