/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'intro' | 'about' | 'article' | 'picture' | 'works' | 'moon';

export interface ColumnArticle {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  content: string;
}

export interface ColumnIssue {
  id: string;
  title: string;       // e.g., "遇见世界"
  issueNo: string;     // e.g., "第一期"
  issueTitle: string;  // e.g., "朔"
  subtitle: string;    // e.g., "万物始于幽暗，又归于初晖"
  date: string;
  mainImage: string;
  summary: string;     // Short description
  textContent: string; // Dynamic content or poetic reading paragraph
  wechatLink?: string; // Optional official WeChat link
  tags: string[];
  articles?: ColumnArticle[];
}

export interface ExhibitionReview {
  id: string;
  title: string;       // Exhibition title e.g. "重返寂静"
  subtitle: string;    // e.g. "当代极简艺术展"
  artist: string;      // Artist or group
  galleryName: string; // e.g. "白立方画廊 White Cube"
  date: string;        // e.g. "2025年11月"
  rating: number;      // e.g. 5
  reviewText: string;  // Poetic review text
  posterUrl: string;   // Image URL for the wall
}

export interface PhotoItem {
  id: string;
  title: string;       // e.g. "竹影横斜"
  category: string;    // e.g. "光影"
  location: string;    // e.g. "京都 · 岚山" / "杭州 · 安曼"
  date: string;        // e.g. "2024.11"
  imageUrl: string;
  description: string; // Poetic description
}

export interface FootprintItem {
  id: string;
  city: string;        // e.g. "北京", "京都"
  cityEn: string;      // e.g. "Beijing", "Kyoto"
  country: string;     // e.g. "中国", "日本"
  location: string;    // Specific landmark/photo location
  lat: number | null;  // 纬度
  lng: number | null;  // 经度
  date: string;        // e.g. "2024.11"
  imageUrl: string;    // Photos represent "东方朗月"'s camera roll for that city
  description: string; // Poetic travel contemplation
  region: '日本' | '华东' | '华北' | '华中' | '西北' | '大湾区';
}

export interface CandleProduct {
  id: string;
  name: string;        // e.g. "墨竹香松"
  nameEn: string;      // e.g. "Ink Bamboo & Pine"
  subtitle: string;    // e.g. "寂静之中的一缕温存"
  description: string;
  story: string;       // Poetic story behind the creation
  ingredients: string; // e.g. "自然大豆蜡、蜂蜡、纯天然植物精油"
  burnTime: string;    // e.g. "35小时"
  size: string;        // e.g. "120g"
  imageUrl: string;
}

export interface ZenQuote {
  id: string;
  text: string;
  author: string;
}
