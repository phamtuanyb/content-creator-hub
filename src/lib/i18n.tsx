import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface Translations {
  [key: string]: string;
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.topics': 'Chủ đề',
    'nav.community': 'Cộng đồng',
    
    // Sidebar Topics
    'topic.sales': 'Content Bán Hàng',
    'topic.customer_care': 'Content Chăm Sóc Khách Hàng',
    'topic.seeding': 'Content Seeding',
    'topic.personal_brand': 'Content Thương Hiệu Cá Nhân Sales',
    'topic.feedback': 'Content Feedback – Case Study',
    'topic.promotion': 'Content Khuyến Mãi',
    'topic.emotion': 'Content Cảm Xúc – Động Lực',
    'topic.industry': 'Content Theo Ngành',
    'topic.software': 'Content Theo Phần Mềm',
    
    // Home Page
    'home.hero.title': 'Thư viện Content',
    'home.hero.subtitle': 'cho Sales',
    'home.hero.description': 'Khám phá hàng nghìn mẫu content chuyên nghiệp, sẵn sàng sử dụng cho mọi nền tảng.',
    'home.hero.explore': 'Khám phá ngay',
    'home.topics.title': 'Chủ đề nổi bật',
    'home.topics.subtitle': 'Khám phá các danh mục content được sử dụng nhiều nhất',
    'home.popular.title': 'Content phổ biến',
    'home.popular.subtitle': 'Các mẫu content được sao chép nhiều nhất tuần này',
    'home.recent.title': 'Content mới nhất',
    'home.recent.subtitle': 'Các mẫu content vừa được thêm vào hệ thống',
    
    // Topic Detail
    'topic.filter.all': 'Tất cả',
    'topic.filter.platform': 'Nền tảng',
    'topic.filter.purpose': 'Mục đích',
    'topic.filter.software': 'Phần mềm',
    'topic.contents': 'nội dung',
    
    // Content Detail
    'content.copy': 'Sao chép nội dung',
    'content.copy.hashtags': 'Sao chép hashtags',
    'content.copy.prompt': 'Sao chép AI Prompt',
    'content.download': 'Tải ảnh',
    'content.copied': 'Đã sao chép!',
    'content.platform': 'Nền tảng',
    'content.purpose': 'Mục đích',
    'content.software': 'Phần mềm',
    'content.hashtags': 'Hashtags',
    'content.cta': 'Call to Action',
    'content.ai_prompt': 'AI Image Prompt',
    'content.images': 'Hình ảnh',
    'content.back': 'Quay lại',
    
    // Platforms
    'platform.facebook': 'Facebook',
    'platform.zalo': 'Zalo',
    'platform.group': 'Group',
    
    // Purposes
    'purpose.introduction': 'Giới thiệu',
    'purpose.closing': 'Chốt sale',
    'purpose.seeding': 'Seeding',
    
    // Admin
    'admin.login.title': 'Đăng nhập Admin',
    'admin.login.email': 'Email',
    'admin.login.password': 'Mật khẩu',
    'admin.login.submit': 'Đăng nhập',
    'admin.login.demo': 'Demo: admin@mkt.com / admin',
    
    'admin.sidebar.dashboard': 'Dashboard',
    'admin.sidebar.topics': 'Quản lý Chủ đề',
    'admin.sidebar.content': 'Quản lý Content',
    'admin.sidebar.images': 'Quản lý Hình ảnh',
    'admin.sidebar.software': 'Quản lý Phần mềm',
    'admin.sidebar.logout': 'Đăng xuất',
    
    'admin.dashboard.title': 'Dashboard',
    'admin.dashboard.total_topics': 'Tổng Chủ đề',
    'admin.dashboard.total_content': 'Tổng Content',
    'admin.dashboard.total_copies': 'Lượt Sao chép',
    'admin.dashboard.total_images': 'Tổng Hình ảnh',
    'admin.dashboard.top_content': 'Content được sao chép nhiều nhất',
    'admin.dashboard.recent_content': 'Content mới thêm gần đây',
    
    'admin.topics.title': 'Quản lý Chủ đề',
    'admin.topics.add': 'Thêm Chủ đề',
    'admin.topics.name': 'Tên chủ đề',
    'admin.topics.category': 'Danh mục',
    'admin.topics.contents': 'Số content',
    'admin.topics.status': 'Trạng thái',
    'admin.topics.actions': 'Thao tác',
    
    'admin.content.title': 'Quản lý Content',
    'admin.content.add': 'Thêm Content',
    'admin.content.name': 'Tiêu đề',
    'admin.content.topic': 'Chủ đề',
    'admin.content.platform': 'Nền tảng',
    'admin.content.purpose': 'Mục đích',
    'admin.content.status': 'Trạng thái',
    'admin.content.created': 'Ngày tạo',
    'admin.content.actions': 'Thao tác',
    
    'admin.software.title': 'Quản lý Phần mềm',
    'admin.software.add': 'Thêm Phần mềm',
    'admin.software.name': 'Tên phần mềm',
    'admin.software.description': 'Mô tả',
    'admin.software.tag': 'Tag',
    'admin.software.status': 'Trạng thái',
    'admin.software.actions': 'Thao tác',
    
    'admin.images.title': 'Quản lý Hình ảnh',
    'admin.images.linked': 'Liên kết với',
    
    // Common
    'common.active': 'Hoạt động',
    'common.inactive': 'Ẩn',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.search': 'Tìm kiếm...',
    'common.view_all': 'Xem tất cả',
    'common.copies': 'lượt copy',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.topics': 'Topics',
    'nav.community': 'Community',
    
    // Sidebar Topics
    'topic.sales': 'Sales Content',
    'topic.customer_care': 'Customer Care Content',
    'topic.seeding': 'Seeding Content',
    'topic.personal_brand': 'Personal Brand Content',
    'topic.feedback': 'Feedback & Case Study',
    'topic.promotion': 'Promotion Content',
    'topic.emotion': 'Motivation Content',
    'topic.industry': 'Industry Content',
    'topic.software': 'Software Content',
    
    // Home Page
    'home.hero.title': 'Content Library',
    'home.hero.subtitle': 'for Sales',
    'home.hero.description': 'Discover thousands of professional content templates, ready to use on any platform.',
    'home.hero.explore': 'Explore Now',
    'home.topics.title': 'Featured Topics',
    'home.topics.subtitle': 'Explore the most used content categories',
    'home.popular.title': 'Popular Content',
    'home.popular.subtitle': 'Most copied content templates this week',
    'home.recent.title': 'Recent Content',
    'home.recent.subtitle': 'Content templates just added to the system',
    
    // Topic Detail
    'topic.filter.all': 'All',
    'topic.filter.platform': 'Platform',
    'topic.filter.purpose': 'Purpose',
    'topic.filter.software': 'Software',
    'topic.contents': 'contents',
    
    // Content Detail
    'content.copy': 'Copy Content',
    'content.copy.hashtags': 'Copy Hashtags',
    'content.copy.prompt': 'Copy AI Prompt',
    'content.download': 'Download Image',
    'content.copied': 'Copied!',
    'content.platform': 'Platform',
    'content.purpose': 'Purpose',
    'content.software': 'Software',
    'content.hashtags': 'Hashtags',
    'content.cta': 'Call to Action',
    'content.ai_prompt': 'AI Image Prompt',
    'content.images': 'Images',
    'content.back': 'Go Back',
    
    // Platforms
    'platform.facebook': 'Facebook',
    'platform.zalo': 'Zalo',
    'platform.group': 'Group',
    
    // Purposes
    'purpose.introduction': 'Introduction',
    'purpose.closing': 'Closing Sale',
    'purpose.seeding': 'Seeding',
    
    // Admin
    'admin.login.title': 'Admin Login',
    'admin.login.email': 'Email',
    'admin.login.password': 'Password',
    'admin.login.submit': 'Login',
    'admin.login.demo': 'Demo: admin@mkt.com / admin',
    
    'admin.sidebar.dashboard': 'Dashboard',
    'admin.sidebar.topics': 'Manage Topics',
    'admin.sidebar.content': 'Manage Content',
    'admin.sidebar.images': 'Manage Images',
    'admin.sidebar.software': 'Manage Software',
    'admin.sidebar.logout': 'Logout',
    
    'admin.dashboard.title': 'Dashboard',
    'admin.dashboard.total_topics': 'Total Topics',
    'admin.dashboard.total_content': 'Total Content',
    'admin.dashboard.total_copies': 'Total Copies',
    'admin.dashboard.total_images': 'Total Images',
    'admin.dashboard.top_content': 'Most Copied Content',
    'admin.dashboard.recent_content': 'Recently Added Content',
    
    'admin.topics.title': 'Manage Topics',
    'admin.topics.add': 'Add Topic',
    'admin.topics.name': 'Topic Name',
    'admin.topics.category': 'Category',
    'admin.topics.contents': 'Contents',
    'admin.topics.status': 'Status',
    'admin.topics.actions': 'Actions',
    
    'admin.content.title': 'Manage Content',
    'admin.content.add': 'Add Content',
    'admin.content.name': 'Title',
    'admin.content.topic': 'Topic',
    'admin.content.platform': 'Platform',
    'admin.content.purpose': 'Purpose',
    'admin.content.status': 'Status',
    'admin.content.created': 'Created',
    'admin.content.actions': 'Actions',
    
    'admin.software.title': 'Manage Software',
    'admin.software.add': 'Add Software',
    'admin.software.name': 'Software Name',
    'admin.software.description': 'Description',
    'admin.software.tag': 'Tag',
    'admin.software.status': 'Status',
    'admin.software.actions': 'Actions',
    
    'admin.images.title': 'Manage Images',
    'admin.images.linked': 'Linked to',
    
    // Common
    'common.active': 'Active',
    'common.inactive': 'Hidden',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search...',
    'common.view_all': 'View All',
    'common.copies': 'copies',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mkt-language');
    return (saved as Language) || 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mkt-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
