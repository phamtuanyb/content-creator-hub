import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { useVisibleData } from '@/hooks/useVisibleData';
import {
  ShoppingCart,
  HeartHandshake,
  Sprout,
  User,
  Star,
  Gift,
  Flame,
  Building2,
  Boxes,
  LayoutGrid,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ShoppingCart,
  HeartHandshake,
  Sprout,
  User,
  Star,
  Gift,
  Flame,
  Building2,
  Boxes,
};

const topicTranslationKeys: Record<string, string> = {
  'sales': 'topic.sales',
  'customer-care': 'topic.customer_care',
  'seeding': 'topic.seeding',
  'personal-brand': 'topic.personal_brand',
  'feedback': 'topic.feedback',
  'promotion': 'topic.promotion',
  'emotion': 'topic.emotion',
  'industry': 'topic.industry',
  'software': 'topic.software',
};

export function UserSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useI18n();
  const { getVisibleTopics } = useVisibleData();

  // Non-admin/public only see active topics; admin sees all.
  const visibleTopics = getVisibleTopics();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-[calc(100vh-64px)] sticky top-16">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {t('nav.topics')}
        </h3>
        
        <nav className="space-y-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              currentPath === '/'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            {t('topic.filter.all')}
          </Link>
          
          {visibleTopics.map((topic) => {
            const Icon = iconMap[topic.icon] || LayoutGrid;
            const isActive = currentPath === `/topic/${topic.id}`;
            const translationKey = topicTranslationKeys[topic.id];
            
            return (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{translationKey ? t(translationKey) : topic.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
