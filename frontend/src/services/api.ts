import { ColumnIssue, ExhibitionReview, PhotoItem, FootprintItem, CandleProduct, ZenQuote } from '../types';

// 动态提取当前浏览器访问的主机名（如 localhost、127.0.0.1 或局域网/公网 IP），实现零配置前后端域名自动对齐
const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${currentHost}:8998/api`;
// 仅包含协议 + 主机 + 端口，用于 upload 返回的相对路径拼接等场景
export const API_ORIGIN = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : `http://${currentHost}:8998`;

let bioCache: any = null;

export const api = {
  clearBioCache() {
    bioCache = null;
  },

  async getBio() {
    if (bioCache) return bioCache;
    const res = await fetch(`${API_BASE_URL}/bio`);
    if (!res.ok) throw new Error('获取个人信息失败');
    bioCache = await res.json();
    return bioCache;
  },

  async getIssues(): Promise<ColumnIssue[]> {
    const res = await fetch(`${API_BASE_URL}/issues`);
    if (!res.ok) throw new Error('获取期刊列表失败');
    return res.json();
  },

  async getIssueById(id: string): Promise<ColumnIssue> {
    const res = await fetch(`${API_BASE_URL}/issues/${id}`);
    if (!res.ok) throw new Error('获取期刊详情失败');
    return res.json();
  },

  async getExhibitions(): Promise<ExhibitionReview[]> {
    const res = await fetch(`${API_BASE_URL}/exhibitions`);
    if (!res.ok) throw new Error('获取展览列表失败');
    return res.json();
  },

  async getPhotos(): Promise<PhotoItem[]> {
    const res = await fetch(`${API_BASE_URL}/photos`);
    if (!res.ok) throw new Error('获取摄影列表失败');
    return res.json();
  },

  async getFootprints(): Promise<FootprintItem[]> {
    const res = await fetch(`${API_BASE_URL}/footprints`);
    if (!res.ok) throw new Error('获取足迹数据失败');
    return res.json();
  },

  async getCandles(): Promise<CandleProduct[]> {
    const res = await fetch(`${API_BASE_URL}/candles`);
    if (!res.ok) throw new Error('获取香薰列表失败');
    return res.json();
  },

  async getQuotes(): Promise<ZenQuote[]> {
    const res = await fetch(`${API_BASE_URL}/quotes`);
    if (!res.ok) throw new Error('获取名言列表失败');
    return res.json();
  },

  async getMoonPhases(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/moon-phases`);
    if (!res.ok) throw new Error('获取月相列表失败');
    return res.json();
  },
};
