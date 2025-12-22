import { useParams } from 'react-router-dom';
import { useDataStore } from '@/lib/dataStore';
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
  const { getTopicById, getContentsByTopic, getActiveSoftware, getPublishedContents } = useDataStore();
  
  const topic = getTopicById(id || '');
  const software = getActiveSoftware();
  
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [softwareFilter, setSoftwareFilter] = useState<string>('all');

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Không tìm thấy chủ đề</h2>
      </div>
    );
  }

  // Chỉ lấy content đã published của topic này
  const topicContents = getContentsByTopic(id || '').filter(c => c.status === 'published');

  const filteredContents = topicContents.filter(content => {
    if (platformFilter !== 'all' && !content.platforms.includes(platformFilter)) return false;
    if (purposeFilter !== 'all' && content.purpose !== purposeFilter) return false;
    if (softwareFilter !== 'all' && content.softwareId !== softwareFilter) return false;
    return true;
  });

  const platforms = [...new Set(topicContents.flatMap(c => c.platforms))];
  const purposes = [...new Set(topicContents.map(c => c.purpose).filter(Boolean))];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{topic.nameVi}</h1>
          <p className="text-muted-foreground">{topic.description}</p>
        </div>
        <Badge variant="primary" className="w-fit">
          {topicContents.length} mẫu nội dung
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Lọc:
        </div>
        
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Nền tảng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nền tảng</SelectItem>
            {platforms.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={purposeFilter} onValueChange={setPurposeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Mục đích" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mục đích</SelectItem>
            {purposes.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {topic.id === '9' && (
          <Select value={softwareFilter} onValueChange={setSoftwareFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Phần mềm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phần mềm</SelectItem>
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
            Xóa bộ lọc
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
          <p>Không có nội dung phù hợp với bộ lọc</p>
        </div>
      )}
    </div>
  );
}
