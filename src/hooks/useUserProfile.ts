import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface UserProfileSettings {
  phone_number: string | null;
  signature_text: string | null;
  full_name: string | null;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profileSettings, setProfileSettings] = useState<UserProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileSettings = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number, signature_text, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile settings:', error);
        return;
      }

      setProfileSettings(data as UserProfileSettings);
    } catch (error) {
      console.error('Error in fetchProfileSettings:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfileSettings();
  }, [fetchProfileSettings]);

  const updateProfileSettings = async (updates: Partial<UserProfileSettings>) => {
    if (!user?.id) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      // Refresh local state
      setProfileSettings((prev) => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Build copy text with hotline and signature
  const buildCopyText = (contentBody: string): string => {
    let result = contentBody;

    if (profileSettings?.phone_number) {
      result += `\n\nLiên hệ ngay hotline: ${profileSettings.phone_number}`;
    }

    if (profileSettings?.signature_text) {
      result += `\n\n${profileSettings.signature_text}`;
    }

    return result;
  };

  return {
    profileSettings,
    loading,
    updateProfileSettings,
    buildCopyText,
    refetch: fetchProfileSettings,
  };
}
