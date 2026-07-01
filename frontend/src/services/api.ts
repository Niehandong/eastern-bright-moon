import { ColumnIssue, ExhibitionReview, PhotoItem, FootprintItem, CandleProduct, ZenQuote } from '../types';

// 动态提取当前浏览器访问的主机名（如 localhost、127.0.0.1 或局域网/公网 IP），实现零配置前后端域名自动对齐
const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${currentHost}:8998/api`;
// 仅包含协议 + 主机 + 端口，用于 upload 返回的相对路径拼接等场景
export const API_ORIGIN = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : `http://${currentHost}:8998`;

// 统一解析图片/资源地址，供所有 <img src> 渲染时使用：
//  - 空值 -> 返回空串
//  - 外链或历史遗留的完整地址（http(s)://...）-> 原样返回（兼容旧数据，无需洗库）
//  - 后端相对路径（/static/uploads/...）-> 按环境补齐来源：
//      生产 API_ORIGIN='' -> 仍是相对路径，由 nginx 代理 /static
//      开发 API_ORIGIN='http://host:8998' -> 直连后端
// 数据库统一只存相对路径，展示层由本函数负责拼接。
export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

// 后端统一响应信封：{ code, message, data }
// code === 200 表示成功；否则为业务/逻辑错误，message 即后端给出的报错信息。
export interface ApiEnvelope<T = any> {
  code: number;
  message: string;
  data: T;
}

// 统一的 API 异常对象。isNetwork === true 表示请求根本没到达服务器（网络问题）。
export class ApiError extends Error {
  code: number;
  isNetwork: boolean;
  constructor(message: string, code = -1, isNetwork = false) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.isNetwork = isNetwork;
  }
}

// 统一请求入口：path 相对于 API_BASE_URL。
//  - 网络异常（fetch 直接 reject）-> 抛 ApiError(isNetwork=true)，提示网络问题
//  - 业务错误（响应体 code !== 200）-> 抛 ApiError(message=后端 message)
//  - 成功 -> 返回信封中的 data
// 调用方只需 try/catch 一处，按 err.message 提示即可。
export async function request<T = any>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new ApiError('网络异常，请检查网络连接后重试', -1, true);
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // 后端理论上始终返回 JSON 信封；解析失败按服务异常处理
    throw new ApiError(`服务响应异常（HTTP ${res.status}）`, -1, false);
  }

  // 标准信封：以 code 判定成败
  if (body && typeof body === 'object' && 'code' in body) {
    if (body.code === 200) return body.data as T;
    throw new ApiError(body.message || '请求失败', typeof body.code === 'number' ? body.code : -1, false);
  }

  // 兜底：非信封结构（全量信封化后理论上不会走到这里）
  if (!res.ok) throw new ApiError(`请求失败（HTTP ${res.status}）`, -1, false);
  return body as T;
}

let bioCache: any = null;

export const api = {
  clearBioCache() {
    bioCache = null;
  },

  async getBio() {
    if (bioCache) return bioCache;
    bioCache = await request('/bio');
    return bioCache;
  },

  getIssues(): Promise<ColumnIssue[]> {
    return request('/issues');
  },

  getIssueById(id: string): Promise<ColumnIssue> {
    return request(`/issues/${id}`);
  },

  getExhibitions(): Promise<ExhibitionReview[]> {
    return request('/exhibitions');
  },

  getPhotos(): Promise<PhotoItem[]> {
    return request('/photos');
  },

  getFootprints(): Promise<FootprintItem[]> {
    return request('/footprints');
  },

  getCandles(): Promise<CandleProduct[]> {
    return request('/candles');
  },

  getQuotes(): Promise<ZenQuote[]> {
    return request('/quotes');
  },

  getMoonPhases(): Promise<any[]> {
    return request('/moon-phases');
  },
};
