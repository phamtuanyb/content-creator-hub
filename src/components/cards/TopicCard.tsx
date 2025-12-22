import { Link } from 'react-router-dom';
import { Topic } from '@/lib/mockData';
import { cn } from '@/lib/utils';
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
  ArrowRight,
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

const colorMap: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

interface TopicCardProps {
  topic: Topic;
  featured?: boolean;
}

export function TopicCard({ topic, featured }: TopicCardProps) {
  const Icon = iconMap[topic.icon] || LayoutGrid;
  const colorClass = colorMap[topic.color] || colorMap.primary;

  if (featured) {
    return (
      <Link
        to={`/topic/${topic.id}`}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground card-hover"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider opacity-80">
              Featured
            </span>
          </div>
          
          <h3 className="text-xl font-bold mb-2">{topic.nameVi}</h3>
          <p className="text-sm opacity-80 mb-4 line-clamp-2">{topic.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{topic.contentCount} templates</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/topic/${topic.id}`}
      className="group relative overflow-hidden rounded-xl bg-card border border-border p-5 card-hover"
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {topic.nameVi}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {topic.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{topic.contentCount}</span>
            <span>templates</span>
          </div>
        </div>
      </div>
      
      <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
