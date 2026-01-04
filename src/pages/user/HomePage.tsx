import { PremiumContentCard } from '@/components/cards/PremiumContentCard';
import { ProgramBannerBox } from '@/components/ProgramBannerBox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  LogIn, 
  UserPlus,
  Zap,
  Star,
  BookOpen,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useVisibleData } from '@/hooks/useVisibleData';

export function HomePage() {
  const { t } = useI18n();
  const { user, canAccessAdmin } = useAuth();
  const { getVisibleTopics, getVisiblePublishedContents, loading } = useVisibleData();

  const isAuthenticated = !!user;

  const visibleTopics = getVisibleTopics();
  const visibleContents = getVisiblePublishedContents();

  const featuredContent = visibleContents[0];
  const popularContents = [...visibleContents]
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, 6);
  const recentContents = [...visibleContents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  const trendingContents = [...visibleContents]
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, 5);

  // Show loading state for authenticated users
  if (isAuthenticated && loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Landing page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        {/* Hero Section - Premium Landing */}
        <section className="relative overflow-hidden rounded-3xl min-h-[500px] lg:min-h-[600px]">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/90 to-indigo-900" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
          
          {/* Glow orbs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] animate-float" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex items-center min-h-[500px] lg:min-h-[600px] p-8 lg:p-16">
            <div className="max-w-3xl">
              {/* Premium badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-6">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="gradient-text">Content Hub Premium</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('home.hero.title')}
                <span className="block mt-2 gradient-text">{t('home.hero.subtitle')}</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
                {t('home.hero.description')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-glow"
                  asChild
                >
                  <Link to="/auth">
                    <LogIn className="h-4 w-4" />
                    Đăng nhập
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm transition-all duration-300"
                  asChild
                >
                  <Link to="/auth?mode=register">
                    <UserPlus className="h-4 w-4" />
                    Đăng ký miễn phí
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">{visibleContents.length}+</div>
                  <div className="text-sm text-white/60">Nội dung chất lượng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{visibleTopics.length}</div>
                  <div className="text-sm text-white/60">Chủ đề đa dạng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {visibleContents.reduce((acc, c) => acc + c.copyCount, 0)}+
                  </div>
                  <div className="text-sm text-white/60">Lượt sử dụng</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Banner Box */}
        <ProgramBannerBox />
      </div>
    );
  }
  
  // Full content for authenticated users
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Main Layout - 3 columns on large screens */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Content - 8 columns */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Featured Article Hero */}
          {featuredContent && (
            <section className="animate-slide-up">
              <PremiumContentCard 
                content={featuredContent} 
                variant="featured"
              />
            </section>
          )}

          {/* Program Banner */}
          <ProgramBannerBox />

          {/* Popular Content */}
          <section className="animate-slide-up stagger-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t('home.popular.title')}</h2>
                  <p className="text-sm text-muted-foreground">Nội dung được yêu thích nhất</p>
                </div>
              </div>
              <Link 
                to="/topics" 
                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline group"
              >
                {t('common.view_all')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {popularContents.slice(0, 4).map((content, i) => (
                <PremiumContentCard 
                  key={content.id} 
                  content={content}
                  className={`animate-slide-up stagger-${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* Recent Content */}
          <section className="animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t('home.recent.title')}</h2>
                  <p className="text-sm text-muted-foreground">Cập nhật mới nhất</p>
                </div>
              </div>
              <Link 
                to="/topics" 
                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline group"
              >
                {t('common.view_all')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {recentContents.slice(0, 4).map((content, i) => (
                <PremiumContentCard 
                  key={content.id} 
                  content={content}
                  className={`animate-slide-up stagger-${i + 1}`}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar - 4 columns */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions Card */}
          <div className="glass-strong rounded-2xl p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Truy cập nhanh</h3>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all"
                asChild
              >
                <Link to="/topics">
                  <BookOpen className="h-4 w-4" />
                  Khám phá chủ đề
                </Link>
              </Button>
              
              {canAccessAdmin() && (
                <Button 
                  className="w-full justify-start gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  asChild
                >
                  <Link to="/admin">
                    <Star className="h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Trending Articles */}
          <div className="glass-strong rounded-2xl p-6 animate-slide-up stagger-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <h3 className="font-semibold">Đang thịnh hành</h3>
            </div>
            
            <div className="space-y-3">
              {trendingContents.map((content, index) => (
                <div key={content.id} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <PremiumContentCard 
                    content={content} 
                    variant="compact"
                    showTopic={false}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Categories Quick Links */}
          {visibleTopics.length > 0 && (
            <div className="glass-strong rounded-2xl p-6 animate-slide-up stagger-2">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Chủ đề</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {visibleTopics.slice(0, 8).map(topic => (
                  <Link 
                    key={topic.id}
                    to={`/topic/${topic.id}`}
                  >
                    <Badge 
                      variant="secondary" 
                      className="hover:bg-primary/20 hover:text-primary transition-all cursor-pointer px-3 py-1.5"
                    >
                      {topic.nameVi}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats Card */}
          <div className="glass-strong rounded-2xl p-6 animate-slide-up stagger-3">
            <h3 className="font-semibold mb-4">Thống kê</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/10">
                <div className="text-2xl font-bold gradient-text">{visibleContents.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Nội dung</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/10">
                <div className="text-2xl font-bold text-purple-500">{visibleTopics.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Chủ đề</div>
              </div>
              <div className="col-span-2 text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/10">
                <div className="text-2xl font-bold text-orange-500">
                  {visibleContents.reduce((acc, c) => acc + c.copyCount, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Tổng lượt sao chép</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
