import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: values.oldPassword,
          new_password: values.newPassword
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || '密码修改失败');
      }

      message.success('密码修改成功，安全凭证已失效，请重新登录！');
      localStorage.removeItem('admin_token');
      setTimeout(() => navigate('/admin/login'), 1500);
    } catch (err: any) {
      message.error(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#e8e2d8] p-4 max-w-lg bg-white rounded-none shadow-sm">
      <div className="mb-8">
        <h3 className="text-lg font-light tracking-[0.15em] text-[#2c2722]">安全密码设置</h3>
        <p className="text-[10px] text-[#8c8273] tracking-widest mt-1">ACCOUNT SECURITY & PASSWORD UPDATE</p>
      </div>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          label={<span className="text-xs text-[#2c2722]">当前旧密码 / Current Password</span>}
          name="oldPassword"
          rules={[{ required: true, message: '请输入您当前的旧密码' }]}
        >
          <Input.Password className="h-10" placeholder="当前密码" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs text-[#2c2722]">新密码 / New Password</span>}
          name="newPassword"
          rules={[
            { required: true, message: '请输入至少 8 位的新密码' },
            { min: 8, message: '密码长度不能少于 8 位' }
          ]}
        >
          <Input.Password className="h-10" placeholder="最少 8 位的新密码" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs text-[#2c2722]">确认新密码 / Confirm Password</span>}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请再次输入新密码进行确认' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的新密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password className="h-10" placeholder="确认新密码" />
        </Form.Item>

        <Form.Item className="mt-8">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            className="px-8 h-10 text-xs tracking-widest"
          >
            保存并强制退出修改 / SAVE & RE-ENTER
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
