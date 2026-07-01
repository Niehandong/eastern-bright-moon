import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { request } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', values.username);
      formData.append('password', values.password);

      const data: any = await request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      localStorage.setItem('admin_token', data.access_token);
      message.success('登录成功，欢迎回到东方朗月！');
      navigate('/admin/dashboard');
    } catch (err: any) {
      message.error(err.message || '登录出错');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center font-serif relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-xs text-[#8c8273] hover:text-[#2c2722] flex items-center gap-2 cursor-pointer transition-colors"
      >
        <ArrowLeftOutlined /> 返回主站
      </button>

      <div className="w-[380px] border border-[#e8e2d8] shadow-sm bg-white p-6 rounded-none">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-light tracking-[0.25em] text-[#2c2722]">控制台登录</h2>
          <p className="text-[10px] text-[#8c8273] tracking-widest mt-2 uppercase">ADMIN CONSOLE LOGIN</p>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label={<span className="text-xs tracking-wider text-[#2c2722]">账户名 / Username</span>}
            name="username"
            rules={[{ required: true, message: '请输入管理员账户名' }]}
          >
            <Input className="h-10 text-sm" placeholder="账户名" />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs tracking-wider text-[#2c2722]">安全密码 / Password</span>}
            name="password"
            rules={[{ required: true, message: '请输入登录密码' }]}
          >
            <Input.Password className="h-10 text-sm" placeholder="密码" />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              className="w-full h-11 text-xs tracking-[0.3em] font-medium uppercase"
            >
              登 录 / ENTER
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
