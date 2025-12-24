import { useDataStore, Topic, Content } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';

/**
 * Centralized visibility rules for Topics + Content.
 * - Admin: can see all topics and all contents.
 * - Non-admin (including editor/sales/anonymous): can only see active topics,
 *   and only published contents that belong to active topics.
 */
export function useVisibleData() {
  const { role } = useAuth();
  const {
    topics,
    contents,
    getActiveTopics,
    getPublishedContents,
    getTopicById,
    getContentById,
    getContentsByTopic,
  } = useDataStore();

  const isAdmin = role === 'admin';

  const getVisibleTopics = (): Topic[] => {
    return isAdmin ? topics : getActiveTopics();
  };

  /**
   * Published content that respects hidden-topic visibility.
   * Use this for public/home/library lists.
   */
  const getVisiblePublishedContents = (): Content[] => {
    const visibleTopicIds = new Set(getVisibleTopics().map((t) => t.id));
    const published = getPublishedContents();

    if (isAdmin) return published;

    return published.filter((c) => visibleTopicIds.has(c.topicId));
  };

  /**
   * Generic “visible content” helper.
   * Non-admin: published + topic active.
   * Admin: all contents.
   */
  const getVisibleContents = (): Content[] => {
    const visibleTopicIds = new Set(getVisibleTopics().map((t) => t.id));

    if (isAdmin) return contents;

    return contents.filter((c) => c.status === 'published' && visibleTopicIds.has(c.topicId));
  };

  const isTopicVisible = (topicId: string): boolean => {
    const topic = getTopicById(topicId);
    if (!topic) return false;
    return isAdmin ? true : topic.status === 'active';
  };

  const isContentVisible = (contentId: string): boolean => {
    const content = getContentById(contentId);
    if (!content) return false;
    if (!isTopicVisible(content.topicId)) return false;

    return isAdmin ? true : content.status === 'published';
  };

  const getVisibleContentsByTopic = (topicId: string): Content[] => {
    if (!isTopicVisible(topicId)) return [];

    const topicContents = getContentsByTopic(topicId);

    if (isAdmin) return topicContents;

    return topicContents.filter((c) => c.status === 'published');
  };

  return {
    getVisibleTopics,
    getVisiblePublishedContents,
    getVisibleContents,
    getVisibleContentsByTopic,
    isTopicVisible,
    isContentVisible,
    isAdmin,
  };
}

