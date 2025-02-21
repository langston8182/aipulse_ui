export interface Article {
  _id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  author: string;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  readTime: number;
}

export interface Parameter {
  name: string;
  value: string;
}

export interface EmailRequest {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  bccAddresses?: string[];
}

export interface S3Image {
  id: string;
  fileName: string;
  url: string;
  lastModified?: string;
  size?: number;
}

export interface AnalyticsEvent {
  eventType: 'pageView' | 'share' | 'click';
  hashedIp: string;
  timestamp: string;
  page: string;
  articleId?: string;
  referrer?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  country: string;
  actions: {
    shares: {
      facebook: number;
      linkedin: number;
      x: number;
    };
    clicks: number;
  };
}

export interface AnalyticsData {
  totalVisitors: number;
  totalArticlesSeen: number;
  totalShares: {
    facebook: number;
    linkedin: number;
    x: number;
    total: number;
  };
  distinctCountries: number;
  uniqueVisitorsLast30Days: number;
  top5Articles: Array<{
    count: number;
    articleId: string;
  }>;
  dailyUniqueVisits: Array<{
    date: string;
    uniqueCount: number;
  }>;
}