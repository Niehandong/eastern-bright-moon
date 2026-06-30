import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { IntroScreen } from './components/IntroScreen';
import { AboutSection } from './components/AboutSection';
import { ArticleSection } from './components/ArticleSection';
import { PictureSection } from './components/PictureSection';
import { MoonSection } from './components/MoonSection';
import { SolarDietPage } from './components/SolarDietPage';
import { api } from './services/api';

// 导入后台管理组件
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

// 公共前台游客布局（含导航栏与子页面渲染出口 Outlet）
const GuestPortalLayout: React.FC = () => {
  const location = useLocation();

  // 页面加载时自动拉取最新的个人自述名，动态更新页签标题
  useEffect(() => {
    api.getBio()
      .then(bio => {
        if (bio) {
          document.title = `${bio.name} · ${bio.name_en || 'Eastern Bright Moon'}`;
        }
      })
      .catch(err => console.error('动态同步浏览器标题失败:', err));
  }, []);

  // 每次路由跳转时自动将窗口复位到顶部，提供极致流畅和舒适的阅读体验
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col selection:bg-brand-gold/20 selection:text-brand-dark">
      <Navbar />
      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>
    </div>
  );
};

// 用于 Intro 首屏的特定处理：点击 ENTER 时路由导航至关于我 (/about)
const IntroRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <IntroScreen onEnter={() => navigate('/about')} />;
};

// 鉴权拦截器 (Auth Guard)
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 前台游客门户，统一包裹在 Layout 内，完全实现独立路由分发 */}
        <Route path="/" element={<GuestPortalLayout />}>
          <Route index element={<IntroRouteWrapper />} />
          <Route path="about" element={<AboutSection />} />
          <Route path="article" element={<ArticleSection />} />
          <Route path="picture" element={<PictureSection />} />
          <Route path="moon" element={<MoonSection />} />
        </Route>
        
        {/* 节气膳灵提案页面 */}
        <Route path="/solar-diet" element={<SolarDietPage />} />
        
        {/* 后台登录 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* 受保护后台控制台 */}
        <Route 
          path="/admin/dashboard/*" 
          element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } 
        />
        
        {/* 未知路由重定向回首屏 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
