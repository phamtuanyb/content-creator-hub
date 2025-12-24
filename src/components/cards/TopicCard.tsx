import { Link } from 'react-router-dom';
import type { Topic } from '@/lib/dataStore';
import { cn } from '@/lib/utils';
import { ShoppingCart, HeartHandshake, Sprout, User, Star, Gift, Flame, Building2, Boxes, LayoutGrid, ArrowRight } from 'lucide-react';
const iconMap: Record<string, React.ElementType> = {
  ShoppingCart,
  HeartHandshake,
  Sprout,
  User,
  Star,
  Gift,
  Flame,
  Building2,
  Boxes
};
const colorMap: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive'
};
interface TopicCardProps {
  topic: Topic;
  featured?: boolean;
}
export function TopicCard({
  topic,
  featured
}: TopicCardProps) {
  const Icon = iconMap[topic.icon] || LayoutGrid;
  const colorClass = colorMap[topic.color] || colorMap.primary;
  if (featured) {
    return null;
  }
  return <Link to={`/topic/${topic.id}`} className="group relative overflow-hidden rounded-xl bg-card border border-border p-5 card-hover">
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
    </Link>;
}