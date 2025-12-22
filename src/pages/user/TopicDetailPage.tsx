import { useParams } from 'react-router-dom';
import { topics, contents, software } from '@/lib/mockData';
import { ContentCard } from '@/components/cards/ContentCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Filter } from 'lucide-react';

export function TopicDetailPage() {
  const { id } = useParams();
  const topic = topics.find(t => t.id === id);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [softwareFilter, setSoftwareFilter] = useState<string>('all');

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Topic not found</h2>
      </div>
    );
  }

  const topicContents = contents.filter(c => c.topicId === id);

  const filteredContents = topicContents.filter(content => {
    if (platformFilter !== 'all' && !content.platforms.includes(platformFilter)) return false;
    if (purposeFilter !== 'all' && content.purpose !== purposeFilter) return false;
    if (softwareFilter !== 'all' && content.softwareId !== softwareFilter) return false;
    return true;
  });

  const platforms = [...new Set(topicContents.flatMap(c => c.platforms))];
  const purposes = [...new Set(topicContents.map(c => c.purpose))];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{topic.nameVi}</h1>
          <p className="text-muted-foreground">{topic.description}</p>
        </div>
        <Badge variant="primary" className="w-fit">
          {topicContents.length} templates
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filters:
        </div>
        
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={purposeFilter} onValueChange={setPurposeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Purposes</SelectItem>
            {purposes.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {topic.id === '9' && (
          <Select value={softwareFilter} onValueChange={setSoftwareFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Software" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Software</SelectItem>
              {software.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {(platformFilter !== 'all' || purposeFilter !== 'all' || softwareFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPlatformFilter('all');
              setPurposeFilter('all');
              setSoftwareFilter('all');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Content Grid */}
      {filteredContents.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredContents.map((content) => (
            <ContentCard key={content.id} content={content} showTopic={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No content matches your filters</p>
        </div>
      )}
    </div>
  );
}
