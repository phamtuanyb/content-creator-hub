import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface DatabaseContent {
  id: string;
  title: string;
  body: string | null;
  topic_id: string | null;
  software_id: string | null;
  image_url: string | null;
  status: string;
  copy_count: number | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentFormData {
  title: string;
  body: string;
  topic_id?: string;
  software_id?: string;
  image_url?: string;
  status: 'draft' | 'published';
  owner_id?: string;
}

export function useContentSync() {
  const [contents, setContents] = useState<DatabaseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch all contents from database
  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching contents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new content
  const addContent = useCallback(async (contentData: ContentFormData) => {
    const { data, error } = await supabase
      .from('content')
      .insert({
        title: contentData.title,
        body: contentData.body,
        topic_id: contentData.topic_id || null,
        software_id: contentData.software_id || null,
        image_url: contentData.image_url || null,
        status: contentData.status,
        owner_id: contentData.owner_id || user?.id || null,
        copy_count: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Ensure UI updates immediately even if realtime is delayed/unavailable
    if (data) {
      setContents((prev) => [data as DatabaseContent, ...prev.filter((c) => c.id !== data.id)]);
    }

    return data;
  }, [user?.id]);

  // Update existing content
  const updateContent = useCallback(async (id: string, contentData: Partial<ContentFormData>) => {
    const { data, error } = await supabase
      .from('content')
      .update({
        ...contentData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Ensure UI updates immediately even if realtime is delayed/unavailable
    if (data) {
      setContents((prev) => prev.map((c) => (c.id === id ? (data as DatabaseContent) : c)));
    }

    return data;
  }, []);

  // Delete content
  const deleteContent = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Ensure UI updates immediately even if realtime is delayed/unavailable
    setContents((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Increment copy count
  const incrementCopyCount = useCallback(async (id: string) => {
    const content = contents.find((c) => c.id === id);
    if (!content) return;

    const nextCount = (content.copy_count || 0) + 1;

    const { data, error } = await supabase
      .from('content')
      .update({ copy_count: nextCount })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error incrementing copy count:', error);
      return;
    }

    if (data) {
      setContents((prev) => prev.map((c) => (c.id === id ? (data as DatabaseContent) : c)));
    }
  }, [contents]);

  // Get content by ID
  const getContentById = useCallback((id: string) => {
    return contents.find(c => c.id === id);
  }, [contents]);

  // Get published contents
  const getPublishedContents = useCallback(() => {
    return contents.filter(c => c.status === 'published');
  }, [contents]);

  // Get contents by topic
  const getContentsByTopic = useCallback((topicId: string) => {
    return contents.filter(c => c.topic_id === topicId);
  }, [contents]);

  // Initial fetch and realtime subscription
  useEffect(() => {
    fetchContents();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content',
        },
        (payload) => {
          console.log('[realtime] content change:', payload.eventType, payload);

          if (payload.eventType === 'INSERT') {
            const row = payload.new as DatabaseContent | null;
            if (!row?.id) return;
            setContents((prev) => [row, ...prev.filter((c) => c.id !== row.id)]);
            return;
          }

          if (payload.eventType === 'UPDATE') {
            const row = payload.new as DatabaseContent | null;
            if (!row?.id) return;
            setContents((prev) => {
              const exists = prev.some((c) => c.id === row.id);
              return exists ? prev.map((c) => (c.id === row.id ? row : c)) : [row, ...prev];
            });
            return;
          }

          if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as Partial<DatabaseContent> | null;
            const id = (oldRow as any)?.id as string | undefined;
            if (!id) return;
            setContents((prev) => prev.filter((c) => c.id !== id));
          }
        }
      )
      .subscribe((status) => {
        console.log('[realtime] content-changes status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContents]);

  return {
    contents,
    loading,
    error,
    addContent,
    updateContent,
    deleteContent,
    incrementCopyCount,
    getContentById,
    getPublishedContents,
    getContentsByTopic,
    refetch: fetchContents,
  };
}
