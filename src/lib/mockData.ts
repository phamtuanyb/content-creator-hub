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
}

export const topics: Topic[] = [
  {
    id: '1',
    name: 'Sales Content',
    nameVi: 'Content Bán Hàng',
    description: 'Content templates for direct sales and closing deals',
    icon: 'ShoppingCart',
    contentCount: 45,
    status: 'active',
    color: 'primary',
  },
  {
    id: '2',
    name: 'Customer Care',
    nameVi: 'Content Chăm Sóc Khách Hàng',
    description: 'Templates for customer support and follow-up',
    icon: 'HeartHandshake',
    contentCount: 32,
    status: 'active',
    color: 'info',
  },
  {
    id: '3',
    name: 'Seeding Content',
    nameVi: 'Content Seeding',
    description: 'Organic engagement and community building',
    icon: 'Sprout',
    contentCount: 28,
    status: 'active',
    color: 'success',
  },
  {
    id: '4',
    name: 'Personal Branding',
    nameVi: 'Content Thương Hiệu Cá Nhân Sales',
    description: 'Build your personal brand as a sales professional',
    icon: 'User',
    contentCount: 20,
    status: 'active',
    color: 'warning',
  },
  {
    id: '5',
    name: 'Case Studies',
    nameVi: 'Content Feedback – Case Study',
    description: 'Success stories and customer testimonials',
    icon: 'Star',
    contentCount: 15,
    status: 'active',
    color: 'primary',
  },
  {
    id: '6',
    name: 'Promotions',
    nameVi: 'Content Khuyến Mãi',
    description: 'Promotional offers and discount announcements',
    icon: 'Gift',
    contentCount: 38,
    status: 'active',
    color: 'destructive',
  },
  {
    id: '7',
    name: 'Motivation',
    nameVi: 'Content Cảm Xúc – Động Lực',
    description: 'Inspirational and motivational content',
    icon: 'Flame',
    contentCount: 22,
    status: 'active',
    color: 'warning',
  },
  {
    id: '8',
    name: 'Industry Specific',
    nameVi: 'Content Theo Ngành',
    description: 'Content tailored to specific industries',
    icon: 'Building2',
    contentCount: 50,
    status: 'active',
    color: 'info',
  },
  {
    id: '9',
    name: 'By Software',
    nameVi: 'Content Theo Phần Mềm',
    description: 'Content organized by MKT software products',
    icon: 'Boxes',
    contentCount: 60,
    status: 'active',
    color: 'success',
  },
];

export const software: Software[] = [
  { id: '1', name: 'MKT Care', description: 'Customer care automation tool', tag: 'Chăm sóc', status: 'active' },
  { id: '2', name: 'MKT UID', description: 'User ID extraction and management', tag: 'Data', status: 'active' },
  { id: '3', name: 'MKT Viral', description: 'Viral content distribution', tag: 'Marketing', status: 'active' },
  { id: '4', name: 'MKT Data', description: 'Data analytics and insights', tag: 'Analytics', status: 'active' },
  { id: '5', name: 'MKT Group', description: 'Group management tool', tag: 'Community', status: 'active' },
];

export const contents: Content[] = [
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

export const dashboardStats = {
  totalTopics: topics.length,
  totalContents: contents.length,
  totalCopies: contents.reduce((sum, c) => sum + c.copyCount, 0),
  recentContents: contents.slice(0, 5),
  topContents: [...contents].sort((a, b) => b.copyCount - a.copyCount).slice(0, 5),
};
