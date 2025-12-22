import { dashboardStats, contents } from '@/lib/mockData';
import { StatCard } from '@/components/cards/StatCard';
import { Badge } from '@/components/ui/badge';
import { FolderTree, FileText, Copy, TrendingUp, Clock } from 'lucide-react';

export function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your content hub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Topics"
          value={dashboardStats.totalTopics}
          icon={FolderTree}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Total Content"
          value={dashboardStats.totalContents}
          icon={FileText}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Total Copies"
          value={dashboardStats.totalCopies.toLocaleString()}
          icon={Copy}
          trend={{ value: 23, positive: true }}
        />
        <StatCard
          title="Avg. Copy Rate"
          value={Math.round(dashboardStats.totalCopies / dashboardStats.totalContents)}
          description="Per content template"
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Copied */}
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Most Copied Content</h2>
          </div>
          
          <div className="space-y-3">
            {dashboardStats.topContents.map((content, index) => (
              <div
                key={content.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{content.title}</p>
                  <p className="text-xs text-muted-foreground">{content.copyCount} copies</p>
                </div>
                <Badge variant="primary" className="text-xs">
                  {content.purpose}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Content */}
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Recently Added</h2>
          </div>
          
          <div className="space-y-3">
            {dashboardStats.recentContents.map((content) => (
              <div
                key={content.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{content.title}</p>
                  <p className="text-xs text-muted-foreground">{content.createdAt}</p>
                </div>
                <Badge variant={content.status === 'published' ? 'success' : 'secondary'}>
                  {content.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
