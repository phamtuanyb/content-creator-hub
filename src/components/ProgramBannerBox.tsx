import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgramBanner {
  id: string;
  image_url: string;
  link_url: string | null;
  title: string | null;
  order_index: number;
}

export function ProgramBannerBox() {
  const [banners, setBanners] = useState<ProgramBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      const { data, error } = await supabase
        .from('program_banners')
        .select('id, image_url, link_url, title, order_index')
        .order('order_index', { ascending: true });

      if (!error && data) {
        setBanners(data);
      }
      setLoading(false);
    }

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[16/9] rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {banners.map((banner) => (
          <BannerItem key={banner.id} banner={banner} />
        ))}
      </div>
    </section>
  );
}

function BannerItem({ banner }: { banner: ProgramBanner }) {
  const content = (
    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted group cursor-pointer">
      <img
        src={banner.image_url}
        alt={banner.title || 'Program banner'}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  if (banner.link_url) {
    return (
      <a
        href={banner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}
