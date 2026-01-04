import { useContentSync, DatabaseContent } from './useContentSync';
import { useDataStore, Topic } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';

/**
 * Centralized visibility rules for Topics + Content.
 * Now using Supabase for content data with real-time sync.
 * - Admin: can see all topics and all contents.
 * - Non-admin (including editor/sales/anonymous): can only see active topics,
 *   and only published contents that belong to active topics.
 */
export function useVisibleData() {
  const { role } = useAuth();
  const { contents, loading, addContent, updateContent, deleteContent, incrementCopyCount, refetch } = useContentSync();
  
  // Topics still from local store (can migrate later)
  const {
    topics,
    getActiveTopics,
    getTopicById,
  } = useDataStore();

  const isAdmin = role === 'admin';

  const getVisibleTopics = (): Topic[] => {
    return isAdmin ? topics : getActiveTopics();
  };

  /**
   * Convert database content to app content format for compatibility
   */
  const convertToAppContent = (dbContent: DatabaseContent) => ({
    id: dbContent.id,
    title: dbContent.title,
    body: dbContent.body || '',
    hashtags: [] as string[],
    cta: '',
    topicId: dbContent.topic_id || '',
    softwareId: dbContent.software_id || undefined,
    platforms: [] as string[],
    purpose: '',
    status: dbContent.status as 'draft' | 'published',
    imageUrl: dbContent.image_url || undefined,
    imageDescription: undefined as string | undefined,
    aiImagePrompt: undefined as string | undefined,
    createdAt: dbContent.created_at,
    copyCount: dbContent.copy_count || 0,
    ownerId: dbContent.owner_id || undefined,
  });

  /**
   * Published content that respects hidden-topic visibility.
   * Use this for public/home/library lists.
   */
  const getVisiblePublishedContents = () => {
    const visibleTopicIds = new Set(getVisibleTopics().map((t) => t.id));
    const published = contents.filter(c => c.status === 'published');

    if (isAdmin) return published.map(convertToAppContent);

    return published
      .filter((c) => !c.topic_id || visibleTopicIds.has(c.topic_id))
      .map(convertToAppContent);
  };

  /**
   * Generic "visible content" helper.
   * Non-admin: published + topic active.
   * Admin: all contents.
   */
  const getVisibleContents = () => {
    const visibleTopicIds = new Set(getVisibleTopics().map((t) => t.id));

    if (isAdmin) return contents.map(convertToAppContent);

    return contents
      .filter((c) => c.status === 'published' && (!c.topic_id || visibleTopicIds.has(c.topic_id)))
      .map(convertToAppContent);
  };

  const isTopicVisible = (topicId: string): boolean => {
    const topic = getTopicById(topicId);
    if (!topic) return true; // Allow content without topic
    return isAdmin ? true : topic.status === 'active';
  };

  const isContentVisible = (contentId: string): boolean => {
    const content = contents.find(c => c.id === contentId);
    if (!content) return false;
    if (content.topic_id && !isTopicVisible(content.topic_id)) return false;

    return isAdmin ? true : content.status === 'published';
  };

  const getVisibleContentsByTopic = (topicId: string) => {
    if (!isTopicVisible(topicId)) return [];

    const topicContents = contents.filter(c => c.topic_id === topicId);

    if (isAdmin) return topicContents.map(convertToAppContent);

    return topicContents
      .filter((c) => c.status === 'published')
      .map(convertToAppContent);
  };

  const getContentById = (id: string) => {
    const content = contents.find(c => c.id === id);
    return content ? convertToAppContent(content) : undefined;
  };

  return {
    getVisibleTopics,
    getVisiblePublishedContents,
    getVisibleContents,
    getVisibleContentsByTopic,
    isTopicVisible,
    isContentVisible,
    isAdmin,
    loading,
    // Content actions
    addContent,
    updateContent,
    deleteContent,
    incrementCopyCount,
    getContentById,
    refetch,
  };
}
