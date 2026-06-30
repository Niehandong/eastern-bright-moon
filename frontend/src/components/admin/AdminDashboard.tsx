import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  UserOutlined, BookOutlined, EyeOutlined, CameraOutlined, 
  EnvironmentOutlined, KeyOutlined, HomeOutlined, LogoutOutlined,
  MoonOutlined
} from '@ant-design/icons';

import { AdminSettings } from './AdminSettings';
import { AdminContentManager } from './AdminContentManager';
import { api } from '../../services/api';

const { Header, Sider, Content } = Layout;

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [brandName, setBrandName] = useState('东方朗月');

  useEffect(() => {
    api.getBio()
      .then(bio => {
        if (bio) {
          setBrandName(bio.name || '东方朗月');
        }
      })
      .catch(err => console.error('控制台同步主站标题失败:', err));
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const menuItems = [
    { key: 'bio', icon: <UserOutlined />, label: '个人自述管理' },
    { key: 'moons', icon: <MoonOutlined />, label: '今日月相管理' },
    { key: 'issues', icon: <BookOutlined />, label: '杂志期刊管理' },
    { key: 'reviews', icon: <EyeOutlined />, label: '艺术展评管理' },
    { key: 'photos', icon: <CameraOutlined />, label: '摄影画廊管理' },
    { key: 'footprints', icon: <EnvironmentOutlined />, label: '足迹定点管理' },
    { key: 'settings', icon: <KeyOutlined />, label: '账户安全设置' },
  ];

  const currentKey = location.pathname.split('/').pop() || 'bio';

  return (
    <Layout style={{ background: '#fffdfa', minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      <Sider width={220} theme="light" className="border-r border-[#e8e2d8]" style={{ background: '#fffdfa' }}>
        <div className="flex flex-col justify-center items-center border-b border-[#e8e2d8] h-16" style={{ background: '#fffdfa' }}>
          <h1 className="text-[#2c2722] text-sm tracking-[0.2em] font-semibold leading-none">{brandName}</h1>
          <span className="text-[#8c8273] text-[8px] tracking-[0.1em] block mt-1.5 uppercase leading-none">Admin Center</span>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentKey]}
          items={menuItems}
          onClick={({ key }) => navigate(`/admin/dashboard/${key}`)}
          style={{ background: '#fffdfa', borderRight: 0 }}
          className="mt-4"
        />
      </Sider>
      
      <Layout style={{ background: '#fffdfa', minWidth: 0, height: '100%' }}>
        <Header className="border-b border-[#e8e2d8] px-8 flex items-center justify-between h-16" style={{ background: '#fffdfa' }}>
          <div className="text-xs text-[#8c8273] tracking-widest uppercase">
            控制台仪表盘 / ADMIN DASHBOARD
          </div>
          <div className="flex items-center gap-6">
            <Button 
              type="text" 
              icon={<HomeOutlined />} 
              onClick={() => navigate('/')} 
              className="text-xs text-[#8c8273] hover:text-[#2c2722] cursor-pointer"
            >
              返回游客主站
            </Button>
            <Button 
              type="text" 
              icon={<LogoutOutlined />} 
              onClick={handleLogout} 
              className="text-xs text-red-700/80 hover:text-red-700 cursor-pointer"
            >
              安全退出
            </Button>
          </div>
        </Header>
        
        <Content className="p-8 md:p-12 w-full" style={{ background: '#fffdfa', width: '100%', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <Routes>
            <Route path="bio" element={<AdminContentManager activeKey="bio" />} />
            <Route path="moons" element={<AdminContentManager activeKey="moons" />} />
            <Route path="issues" element={<AdminContentManager activeKey="issues" />} />
            <Route path="reviews" element={<AdminContentManager activeKey="reviews" />} />
            <Route path="photos" element={<AdminContentManager activeKey="photos" />} />
            <Route path="footprints" element={<AdminContentManager activeKey="footprints" />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminContentManager activeKey="bio" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
