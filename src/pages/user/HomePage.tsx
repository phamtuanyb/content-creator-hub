import { TopicCard } from '@/components/cards/TopicCard';
import { ContentCard } from '@/components/cards/ContentCard';
import { ProgramBannerBox } from '@/components/ProgramBannerBox';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Clock, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useVisibleData } from '@/hooks/useVisibleData';
export function HomePage() {
  const { t } = useI18n();
  const { user, canAccessAdmin } = useAuth();
  const { getVisibleTopics, getVisiblePublishedContents } = useVisibleData();

  const isAuthenticated = !!user;

  // Only show active topics for non-admin/public; admin can see all topics.
  const visibleTopics = getVisibleTopics();
  // Only show published contents, and only from active topics for non-admin/public.
  const visibleContents = getVisiblePublishedContents();

  const featuredTopic = visibleTopics[0];
  const otherTopics = visibleTopics.slice(1);
  const popularContents = [...visibleContents].sort((a, b) => b.copyCount - a.copyCount).slice(0, 4);
  const recentContents = [...visibleContents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Landing page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
        {/* Hero Section - Landing Page */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 lg:p-16 text-primary-foreground min-h-[400px] flex items-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              {t('home.hero.title')}
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              {t('home.hero.title')} <span className="text-primary-foreground/80">{t('home.hero.subtitle')}</span>
            </h1>
            <p className="text-lg lg:text-xl opacity-90 mb-8">
              {t('home.hero.description')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="glass" size="lg" className="gap-2" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                <Link to="/auth?mode=register">
                  <UserPlus className="h-4 w-4" />
                  Đăng ký
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Program Banner Box - visible to all */}
        <ProgramBannerBox />
      </div>
    );
  }
  
  // Full content for authenticated users
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 lg:p-12 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            {t('home.hero.title')}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('home.hero.title')} <span className="text-primary-foreground/80">{t('home.hero.subtitle')}</span>
          </h1>
          <p className="text-lg opacity-90 mb-6">
            {t('home.hero.description')}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="glass" size="lg" className="gap-2" asChild>
              <Link to="/topics">
                {t('home.hero.explore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {canAccessAdmin() && (
              <Button variant="glass" size="lg" asChild>
                <Link to="/admin">Admin Panel</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Program Banner Box - visible to all */}
      <ProgramBannerBox />

      {/* More Topics */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">{t('home.topics.title')}</h2>
          <Link to="/topics" className="text-sm text-primary font-medium hover:underline">
            {t('common.view_all')}
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherTopics.slice(4).map(topic => <TopicCard key={topic.id} topic={topic} />)}
        </div>
      </section>

      {/* Popular Content */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t('home.popular.title')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {popularContents.map(content => <ContentCard key={content.id} content={content} />)}
        </div>
      </section>

      {/* Recent Content */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t('home.recent.title')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {recentContents.map(content => <ContentCard key={content.id} content={content} />)}
        </div>
      </section>
    </div>
  );
}
