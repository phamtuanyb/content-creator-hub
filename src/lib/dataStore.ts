import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Topic {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  contentCount: number;
  status: 'active' | 'hidden';
  color: string;
}

export interface Software {
  id: string;
  name: string;
  description: string;
  tag: string;
  status: 'active' | 'hidden';
}

export interface Content {
  id: string;
  title: string;
  body: string;
  hashtags: string[];
  cta: string;
  topicId: string;
  softwareId?: string;
  platforms: string[];
  purpose: string;
  status: 'draft' | 'published';
  imageUrl?: string;
  imageDescription?: string;
  aiImagePrompt?: string;
  createdAt: string;
  copyCount: number;
  ownerId?: string; // User ID of content owner
}

export interface AppImage {
  id: string;
  url: string;
  contentId?: string;
  contentTitle: string;
  description?: string;
  uploadedAt: string;
}

// Initial data
const initialTopics: Topic[] = [
  {
    id: '1',
    name: 'Sales Content',
    nameVi: 'Content Bán Hàng',
    description: 'Content templates for direct sales and closing deals',
    icon: 'ShoppingCart',
    contentCount: 0,
    status: 'active',
    color: 'primary',
  },
  {
    id: '2',
    name: 'Customer Care',
    nameVi: 'Content Chăm Sóc Khách Hàng',
    description: 'Templates for customer support and follow-up',
    icon: 'HeartHandshake',
    contentCount: 0,
    status: 'active',
    color: 'info',
  },
  {
    id: '3',
    name: 'Seeding Content',
    nameVi: 'Content Seeding',
    description: 'Organic engagement and community building',
    icon: 'Sprout',
    contentCount: 0,
    status: 'active',
    color: 'success',
  },
  {
    id: '4',
    name: 'Personal Branding',
    nameVi: 'Content Thương Hiệu Cá Nhân Sales',
    description: 'Build your personal brand as a sales professional',
    icon: 'User',
    contentCount: 0,
    status: 'active',
    color: 'warning',
  },
  {
    id: '5',
    name: 'Case Studies',
    nameVi: 'Content Feedback – Case Study',
    description: 'Success stories and customer testimonials',
    icon: 'Star',
    contentCount: 0,
    status: 'active',
    color: 'primary',
  },
  {
    id: '6',
    name: 'Promotions',
    nameVi: 'Content Khuyến Mãi',
    description: 'Promotional offers and discount announcements',
    icon: 'Gift',
    contentCount: 0,
    status: 'active',
    color: 'destructive',
  },
  {
    id: '7',
    name: 'Motivation',
    nameVi: 'Content Cảm Xúc – Động Lực',
    description: 'Inspirational and motivational content',
    icon: 'Flame',
    contentCount: 0,
    status: 'active',
    color: 'warning',
  },
  {
    id: '8',
    name: 'Industry Specific',
    nameVi: 'Content Theo Ngành',
    description: 'Content tailored to specific industries',
    icon: 'Building2',
    contentCount: 0,
    status: 'active',
    color: 'info',
  },
  {
    id: '9',
    name: 'By Software',
    nameVi: 'Content Theo Phần Mềm',
    description: 'Content organized by MKT software products',
    icon: 'Boxes',
    contentCount: 0,
    status: 'active',
    color: 'success',
  },
];

const initialSoftware: Software[] = [
  { id: '1', name: 'MKT Care', description: 'Customer care automation tool', tag: 'Chăm sóc', status: 'active' },
  { id: '2', name: 'MKT UID', description: 'User ID extraction and management', tag: 'Data', status: 'active' },
  { id: '3', name: 'MKT Viral', description: 'Viral content distribution', tag: 'Marketing', status: 'active' },
  { id: '4', name: 'MKT Data', description: 'Data analytics and insights', tag: 'Analytics', status: 'active' },
  { id: '5', name: 'MKT Group', description: 'Group management tool', tag: 'Community', status: 'active' },
];

const initialContents: Content[] = [
  {
    id: '1',
    title: 'Chào mừng khách hàng mới',
    body: `🎉 Chào mừng bạn đến với gia đình MKT!

Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi. Đây là bước đầu tiên trong hành trình thành công của bạn!

💡 Mẹo nhỏ: Hãy bắt đầu với những tính năng cơ bản trước, sau đó khám phá thêm các công cụ nâng cao.

Nếu cần hỗ trợ, đội ngũ chúng tôi luôn sẵn sàng 24/7!`,
    hashtags: ['#MKT', '#WelcomeNewCustomer', '#Success'],
    cta: 'Bắt đầu ngay →',
    topicId: '2',
    softwareId: '1',
    platforms: ['Facebook', 'Zalo'],
    purpose: 'Giới thiệu',
    status: 'published',
    createdAt: '2024-01-15',
    copyCount: 156,
  },
  {
    id: '2',
    title: 'Flash Sale cuối tuần',
    body: `🔥 FLASH SALE CUỐI TUẦN - GIẢM 50%! 🔥

⏰ Chỉ còn 48 giờ để sở hữu bộ công cụ marketing đỉnh cao với giá ưu đãi chưa từng có!

✅ MKT Care Pro - Chăm sóc khách hàng tự động
✅ MKT UID - Khai thác data chất lượng
✅ MKT Viral - Viral content x10

💰 Giá gốc: 5.000.000đ
💥 Giá sale: 2.500.000đ

🎁 BONUS: Tặng kèm khóa học Marketing Online trị giá 1.500.000đ`,
    hashtags: ['#FlashSale', '#MKT', '#Marketing'],
    cta: 'Mua ngay kẻo lỡ!',
    topicId: '6',
    platforms: ['Facebook', 'Zalo', 'Group'],
    purpose: 'Chốt sale',
    status: 'published',
    createdAt: '2024-01-18',
    copyCount: 342,
  },
  {
    id: '3',
    title: 'Câu chuyện thành công - Anh Minh',
    body: `📈 TỪ 0 ĐẾN 100 TRIỆU/THÁNG TRONG 6 THÁNG

Anh Minh - Chủ shop thời trang online chia sẻ:

"Trước khi dùng MKT, mình chỉ bán được 10-15 đơn/ngày. Sau khi áp dụng các công cụ của MKT, đặc biệt là MKT Care để chăm sóc khách hàng tự động, doanh số tăng gấp 10 lần!"

🎯 Kết quả sau 6 tháng:
• Từ 300 đơn → 3000 đơn/tháng
• Doanh thu: 100 triệu+/tháng
• Tỷ lệ khách quay lại: 45%

Bạn muốn có kết quả tương tự?`,
    hashtags: ['#SuccessStory', '#MKT', '#CaseStudy'],
    cta: 'Xem chi tiết →',
    topicId: '5',
    softwareId: '1',
    platforms: ['Facebook', 'Group'],
    purpose: 'Seeding',
    status: 'published',
    createdAt: '2024-01-20',
    copyCount: 89,
  },
  {
    id: '4',
    title: 'Tips chăm sóc khách hàng hiệu quả',
    body: `💡 5 TIPS CHĂM SÓC KHÁCH HÀNG CHUYÊN NGHIỆP

1️⃣ Phản hồi trong vòng 5 phút
→ Khách hàng chờ đợi = Mất khách hàng

2️⃣ Cá nhân hóa tin nhắn
→ Gọi tên khách hàng, nhớ lịch sử mua hàng

3️⃣ Follow-up đúng thời điểm
→ Sau 3 ngày, 7 ngày, 30 ngày

4️⃣ Giải quyết khiếu nại nhanh chóng
→ Khách hàng than phiền = Cơ hội cải thiện

5️⃣ Tự động hóa với MKT Care
→ Tiết kiệm 80% thời gian, tăng 200% hiệu quả`,
    hashtags: ['#CustomerCare', '#Tips', '#MKTCare'],
    cta: 'Áp dụng ngay!',
    topicId: '2',
    softwareId: '1',
    platforms: ['Facebook', 'Zalo'],
    purpose: 'Giới thiệu',
    status: 'published',
    createdAt: '2024-01-22',
    copyCount: 234,
  },
  {
    id: '5',
    title: 'Motivation Monday',
    body: `🌟 MOTIVATION MONDAY 🌟

"Thành công không phải là đích đến, mà là hành trình. Mỗi ngày bạn bán được một đơn hàng, bạn đã tiến gần hơn đến ước mơ của mình."

💪 Tuần mới, năng lượng mới!

Hãy nhớ:
• Khách hàng từ chối ≠ Thất bại
• Mỗi "không" đưa bạn gần hơn đến "có"
• Kiên trì là chìa khóa thành công

Chúc anh em Sales một tuần làm việc hiệu quả! 🚀`,
    hashtags: ['#MondayMotivation', '#Sales', '#Success'],
    cta: '',
    topicId: '7',
    platforms: ['Facebook', 'Group'],
    purpose: 'Seeding',
    status: 'published',
    createdAt: '2024-01-25',
    copyCount: 178,
  },
];

const initialImages: AppImage[] = [
  { id: '1', url: '/placeholder.svg', contentId: '2', contentTitle: 'Flash Sale cuối tuần', uploadedAt: '2024-01-18' },
  { id: '2', url: '/placeholder.svg', contentId: '4', contentTitle: 'Tips chăm sóc khách hàng', uploadedAt: '2024-01-22' },
  { id: '3', url: '/placeholder.svg', contentId: '5', contentTitle: 'Motivation Monday', uploadedAt: '2024-01-25' },
  { id: '4', url: '/placeholder.svg', contentId: '3', contentTitle: 'Case Study - Anh Minh', uploadedAt: '2024-01-20' },
];

interface DataStore {
  // Data
  topics: Topic[];
  software: Software[];
  contents: Content[];
  images: AppImage[];
  
  // Topic actions
  addTopic: (topic: Omit<Topic, 'id' | 'contentCount'>) => void;
  updateTopic: (id: string, data: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  
  // Software actions
  addSoftware: (software: Omit<Software, 'id'>) => void;
  updateSoftware: (id: string, data: Partial<Software>) => void;
  deleteSoftware: (id: string) => void;
  
  // Content actions
  addContent: (content: Omit<Content, 'id' | 'createdAt' | 'copyCount'>) => void;
  updateContent: (id: string, data: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  incrementCopyCount: (id: string) => void;
  
  // Image actions
  addImage: (image: Omit<AppImage, 'id' | 'uploadedAt'>) => void;
  updateImage: (id: string, data: Partial<AppImage>) => void;
  deleteImage: (id: string) => void;
  
  // Helpers
  getTopicById: (id: string) => Topic | undefined;
  getSoftwareById: (id: string) => Software | undefined;
  getContentById: (id: string) => Content | undefined;
  getContentsByTopic: (topicId: string) => Content[];
  getContentsBySoftware: (softwareId: string) => Content[];
  getPublishedContents: () => Content[];
  getActiveTopics: () => Topic[];
  getActiveSoftware: () => Software[];
  
  // Stats
  getDashboardStats: () => {
    totalTopics: number;
    totalContents: number;
    totalCopies: number;
    recentContents: Content[];
    topContents: Content[];
  };
}

// Helper to calculate content count for topics
const calculateContentCounts = (topics: Topic[], contents: Content[]): Topic[] => {
  return topics.map(topic => ({
    ...topic,
    contentCount: contents.filter(c => c.topicId === topic.id && c.status === 'published').length,
  }));
};

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial data with calculated content counts
      topics: calculateContentCounts(initialTopics, initialContents),
      software: initialSoftware,
      contents: initialContents,
      images: initialImages,
      
      // Topic actions
      addTopic: (topicData) => set((state) => {
        const newTopic: Topic = {
          ...topicData,
          id: String(Date.now()),
          contentCount: 0,
        };
        return { topics: [...state.topics, newTopic] };
      }),
      
      updateTopic: (id, data) => set((state) => ({
        topics: state.topics.map(t => t.id === id ? { ...t, ...data } : t),
      })),
      
      deleteTopic: (id) => set((state) => ({
        topics: state.topics.filter(t => t.id !== id),
      })),
      
      // Software actions
      addSoftware: (softwareData) => set((state) => {
        const newSoftware: Software = {
          ...softwareData,
          id: String(Date.now()),
        };
        return { software: [...state.software, newSoftware] };
      }),
      
      updateSoftware: (id, data) => set((state) => ({
        software: state.software.map(s => s.id === id ? { ...s, ...data } : s),
      })),
      
      deleteSoftware: (id) => set((state) => ({
        software: state.software.filter(s => s.id !== id),
      })),
      
      // Content actions
      addContent: (contentData) => set((state) => {
        const newContent: Content = {
          ...contentData,
          id: String(Date.now()),
          createdAt: new Date().toISOString().split('T')[0],
          copyCount: 0,
        };
        const newContents = [newContent, ...state.contents];
        return { 
          contents: newContents,
          topics: calculateContentCounts(state.topics, newContents),
        };
      }),
      
      updateContent: (id, data) => set((state) => {
        const newContents = state.contents.map(c => c.id === id ? { ...c, ...data } : c);
        return { 
          contents: newContents,
          topics: calculateContentCounts(state.topics, newContents),
        };
      }),
      
      deleteContent: (id) => set((state) => {
        const newContents = state.contents.filter(c => c.id !== id);
        return { 
          contents: newContents,
          topics: calculateContentCounts(state.topics, newContents),
        };
      }),
      
      incrementCopyCount: (id) => set((state) => ({
        contents: state.contents.map(c => 
          c.id === id ? { ...c, copyCount: c.copyCount + 1 } : c
        ),
      })),
      
      // Image actions
      addImage: (imageData) => set((state) => {
        const newImage: AppImage = {
          ...imageData,
          id: String(Date.now()),
          uploadedAt: new Date().toISOString().split('T')[0],
        };
        return { images: [...state.images, newImage] };
      }),
      
      updateImage: (id, data) => set((state) => ({
        images: state.images.map(i => i.id === id ? { ...i, ...data } : i),
      })),
      
      deleteImage: (id) => set((state) => ({
        images: state.images.filter(i => i.id !== id),
      })),
      
      // Helpers
      getTopicById: (id) => get().topics.find(t => t.id === id),
      getSoftwareById: (id) => get().software.find(s => s.id === id),
      getContentById: (id) => get().contents.find(c => c.id === id),
      getContentsByTopic: (topicId) => get().contents.filter(c => c.topicId === topicId),
      getContentsBySoftware: (softwareId) => get().contents.filter(c => c.softwareId === softwareId),
      getPublishedContents: () => get().contents.filter(c => c.status === 'published'),
      getActiveTopics: () => get().topics.filter(t => t.status === 'active'),
      getActiveSoftware: () => get().software.filter(s => s.status === 'active'),
      
      // Stats
      getDashboardStats: () => {
        const state = get();
        return {
          totalTopics: state.topics.length,
          totalContents: state.contents.length,
          totalCopies: state.contents.reduce((sum, c) => sum + c.copyCount, 0),
          recentContents: [...state.contents].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5),
          topContents: [...state.contents].sort((a, b) => b.copyCount - a.copyCount).slice(0, 5),
        };
      },
    }),
    {
      name: 'mkt-content-hub-storage',
      version: 2, // Increment this to reset cached data when schema changes
      migrate: (persistedState: unknown, version: number) => {
        // If version is outdated, return fresh initial state
        if (version < 2) {
          return {
            topics: calculateContentCounts(initialTopics, initialContents),
            software: initialSoftware,
            contents: initialContents,
            images: initialImages,
          };
        }
        return persistedState as DataStore;
      },
    }
  )
);
