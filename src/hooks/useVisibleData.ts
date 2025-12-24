import { useDataStore, Topic, Content } from '@/lib/dataStore';
import { useAuth } from '@/lib/auth';
import { topics as mockTopics, contents as mockContents } from '@/lib/mockData';

/**
 * Hook to get visible topics and contents based on user role.
 * Admin can see all topics/contents.
 * Non-admin users can only see active topics and their published contents.
 */
export function useVisibleData() {
  const { role } = useAuth();
  const { 
    topics: storeTopics, 
    contents: storeContents, 
    getActiveTopics,
    getPublishedContents,
    getTopicById: storeGetTopicById,
    getContentById: storeGetContentById,
    getContentsByTopic: storeGetContentsByTopic,
  } = useDataStore();
  
  const isAdmin = role === 'admin';
  
  // Get visible topics based on role
  const getVisibleTopics = (): Topic[] => {
    if (isAdmin) {
      return storeTopics;
    }
    return getActiveTopics();
  };
  
  // Get visible mock topics (from mockData.ts) based on role
  const getVisibleMockTopics = () => {
    if (isAdmin) {
      return mockTopics;
    }
    return mockTopics.filter(t => t.status === 'active');
  };
  
  // Get visible mock contents based on role and topic visibility
  const getVisibleMockContents = () => {
    const visibleTopicIds = getVisibleMockTopics().map(t => t.id);
    
    if (isAdmin) {
      return mockContents;
    }
    
    return mockContents.filter(c => 
      c.status === 'published' && 
      visibleTopicIds.includes(c.topicId)
    );
  };
  
  // Check if a topic is visible to current user
  const isTopicVisible = (topicId: string): boolean => {
    const topic = storeGetTopicById(topicId);
    if (!topic) {
      // Check mockData
      const mockTopic = mockTopics.find(t => t.id === topicId);
      if (!mockTopic) return false;
      if (isAdmin) return true;
      return mockTopic.status === 'active';
    }
    
    if (isAdmin) return true;
    return topic.status === 'active';
  };
  
  // Check if a content is visible to current user
  const isContentVisible = (contentId: string): boolean => {
    const content = storeGetContentById(contentId);
    if (!content) {
      // Check mockData
      const mockContent = mockContents.find(c => c.id === contentId);
      if (!mockContent) return false;
      
      // Check if topic is visible
      if (!isTopicVisible(mockContent.topicId)) return false;
      
      if (isAdmin) return true;
      return mockContent.status === 'published';
    }
    
    // Check if topic is visible
    if (!isTopicVisible(content.topicId)) return false;
    
    if (isAdmin) return true;
    return content.status === 'published';
  };
  
  // Get visible contents for a specific topic
  const getVisibleContentsByTopic = (topicId: string): Content[] => {
    // First check if topic is visible
    if (!isTopicVisible(topicId)) return [];
    
    const topicContents = storeGetContentsByTopic(topicId);
    
    if (isAdmin) {
      return topicContents;
    }
    
    return topicContents.filter(c => c.status === 'published');
  };
  
  // Get all visible contents
  const getVisibleContents = (): Content[] => {
    const visibleTopicIds = getVisibleTopics().map(t => t.id);
    
    if (isAdmin) {
      return storeContents;
    }
    
    return storeContents.filter(c => 
      c.status === 'published' && 
      visibleTopicIds.includes(c.topicId)
    );
  };
  
  return {
    getVisibleTopics,
    getVisibleMockTopics,
    getVisibleMockContents,
    getVisibleContents,
    getVisibleContentsByTopic,
    isTopicVisible,
    isContentVisible,
    isAdmin,
  };
}
