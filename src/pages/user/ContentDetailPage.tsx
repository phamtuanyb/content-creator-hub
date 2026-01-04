import { useState } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { useDataStore } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useVisibleData } from '@/hooks/useVisibleData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Wand2, ArrowLeft, Calendar, Hash, Image, Pencil, CheckCircle, Upload, Trash2, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { LoginPromptModal } from '@/components/auth/LoginPromptModal';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';

export function ContentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTopicById, getSoftwareById, images, deleteImage } = useDataStore();
  const { getContentById, incrementCopyCount, updateContent, isTopicVisible, isAdmin, loading } = useVisibleData();
  const { role, user, canEditContent, canPublishContent } = useAuth();
  const { buildCopyText } = useUserProfile();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const content = getContentById(id || '');
  const topic = content ? getTopicById(content.topicId) : null;
  const sw = content?.softwareId ? getSoftwareById(content.softwareId) : null;
  
  // Auth check
  const isAuthenticated = !!user;
  
  // Tìm ảnh liên quan đến content này
  const contentImages = images.filter(img => img.contentId === id);

  // Check permissions
  const canEdit = content ? canEditContent(content.ownerId || null) : false;
  const canPublish = canPublishContent();
  const isAdminRole = role === 'admin';

  // Check if the topic is visible (hidden topics shouldn't be accessible to non-admins)
  const topicIsVisible = content ? isTopicVisible(content.topicId) : false;

  // Allow viewing content if: topic is visible AND (published OR owner OR admin)
  const canViewContent = content && topicIsVisible && (
    content.status === 'published' || 
    canEdit || 
    isAdminRole
  );

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Redirect to not-found if content doesn't exist or topic is hidden for non-admin
  if (!content || !canViewContent) {
    return <Navigate to="/not-found" replace />;
  }

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    action();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCopy = (text: string, label: string, withHotline: boolean = false) => {
    requireAuth(() => {
      const textToCopy = withHotline ? buildCopyText(text) : text;
      navigator.clipboard.writeText(textToCopy);
      incrementCopyCount(content.id);
      toast({
        title: "Đã sao chép!",
        description: withHotline ? `${label} kèm hotline đã được sao chép` : `${label} đã được sao chép`,
      });
    });
  };

  const handleCopyImage = async (imageUrl: string) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      toast({
        title: "Đã sao chép ảnh!",
        description: "Ảnh đã được sao chép vào clipboard",
      });
    } catch (error) {
      navigator.clipboard.writeText(imageUrl);
      toast({
        title: "Đã sao chép URL ảnh!",
        description: "URL ảnh đã được sao chép (trình duyệt không hỗ trợ sao chép ảnh trực tiếp)",
      });
    }
  };

  const handleDownloadImage = async (imageUrl: string, filename: string) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Đã tải ảnh!",
        description: "Ảnh đã được tải xuống",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải ảnh",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Back Link */}
        <Link
          to={topic ? `/topic/${topic.id}` : '/'}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại {topic?.nameVi || 'Trang chủ'}
        </Link>

        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl glass-strong p-8 lg:p-10">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[80px]" />
          
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {topic && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm px-3 py-1">
                    {topic.nameVi}
                  </Badge>
                )}
                {sw && (
                  <Badge className="bg-cyan-500/20 text-cyan-500 border-cyan-500/30 backdrop-blur-sm px-3 py-1">
                    {sw.name}
                  </Badge>
                )}
                {content.status === 'draft' && (
                  <Badge variant="secondary" className="px-3 py-1">Bản nháp</Badge>
                )}
              </div>
              
              {/* Role-based action buttons */}
              <div className="flex items-center gap-2">
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/content?edit=${content.id}`)}
                    className="gap-2 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                  >
                    <Pencil className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                )}
                
                {canPublish && content.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      updateContent(content.id, { status: 'published' });
                      toast({ title: 'Đã xuất bản', description: 'Nội dung đã được xuất bản' });
                    }}
                    className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Xuất bản
                  </Button>
                )}
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">{content.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span>{formatDate(content.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/10">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </div>
                <span>{content.copyCount} lượt sao chép</span>
              </div>
            </div>
          </div>
        </div>

      {/* Main Layout: Content + Image side by side */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content Body - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Nội dung</h2>
              <div className="flex gap-2">
                <Button onClick={() => handleCopy(content.body, 'Nội dung', true)} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Sao chép kèm hotline
                </Button>
                <Button variant="outline" onClick={() => handleCopy(content.body, 'Nội dung', false)} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Không hotline
                </Button>
              </div>
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
                  Sao chép tất cả
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
                  Sao chép Prompt
                </Button>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-4 text-sm italic text-muted-foreground">
                {content.aiImagePrompt}
              </div>
            </div>
          )}
        </div>

        {/* Image Section - 1 column */}
        <div className="space-y-6">
          {/* Content Images */}
          <div className="rounded-xl bg-card border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Image className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Hình ảnh</h2>
            </div>
            
            {contentImages.length > 0 ? (
              <div className="space-y-4">
                {contentImages.map((img) => (
                  <div key={img.id} className="space-y-3">
                    <div className="relative group rounded-lg overflow-hidden bg-secondary/30">
                      <img 
                        src={img.url} 
                        alt={img.description || 'Content image'} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {img.description && (
                      <p className="text-xs text-muted-foreground">{img.description}</p>
                    )}
                    <div className="flex gap-2">
                      {/* Download - ALL roles */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadImage(img.url, `${content.title}-${img.id}.jpg`)}
                        className="flex-1 gap-2"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Tải xuống
                      </Button>
                      {/* Delete Image - Admin ONLY */}
                      {isAdminRole && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            deleteImage(img.id);
                            toast({ title: 'Đã xóa', description: 'Ảnh đã được xóa' });
                          }}
                          className="gap-2 text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : content.imageUrl ? (
              <div className="space-y-3">
                <div className="relative group rounded-lg overflow-hidden bg-secondary/30">
                  <img 
                    src={content.imageUrl} 
                    alt={content.imageDescription || 'Content image'} 
                    className="w-full h-auto object-cover"
                  />
                </div>
                {content.imageDescription && (
                  <p className="text-xs text-muted-foreground">{content.imageDescription}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyImage(content.imageUrl!)}
                    className="flex-1 gap-2"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Sao chép ảnh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadImage(content.imageUrl!, `${content.title}.jpg`)}
                    className="flex-1 gap-2"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Tải xuống
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Quick Copy All */}
          <div className="rounded-xl bg-card border border-border p-6">
            <h2 className="font-semibold mb-4">Sao chép nhanh</h2>
            <div className="space-y-2">
              <Button
                variant="default"
                className="w-full gap-2"
                onClick={() => {
                  const fullContent = `${content.body}\n\n${content.hashtags.join(' ')}${content.cta ? `\n\n${content.cta}` : ''}`;
                  handleCopy(fullContent, 'Toàn bộ nội dung', true);
                }}
              >
                <Copy className="h-4 w-4" />
                Sao chép tất cả (kèm hotline)
              </Button>
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => {
                  const fullContent = `${content.body}\n\n${content.hashtags.join(' ')}${content.cta ? `\n\n${content.cta}` : ''}`;
                  handleCopy(fullContent, 'Toàn bộ nội dung', false);
                }}
              >
                <Copy className="h-4 w-4" />
                Sao chép không hotline
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-xl bg-card border border-border p-6">
            <h2 className="font-semibold mb-4">Chi tiết</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nền tảng</p>
                <div className="flex flex-wrap gap-1.5">
                  {content.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary">{platform}</Badge>
                  ))}
                </div>
              </div>
              
              {content.purpose && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mục đích</p>
                  <Badge variant="outline">{content.purpose}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <LoginPromptModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
    </>
  );
}
