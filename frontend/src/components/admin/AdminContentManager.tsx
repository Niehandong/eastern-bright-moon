import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Form, Input, Upload, message, Space, DatePicker, Select } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api, API_ORIGIN, request, resolveAssetUrl } from '../../services/api';

interface AdminContentManagerProps {
  activeKey: 'bio' | 'moons' | 'issues' | 'reviews' | 'photos' | 'footprints';
}

// High-fidelity miniature gold moon phases for admin table rendering
const renderAdminMoonIcon = (type: string) => {
  const baseClass = "w-5 h-5 text-brand-gold";
  switch (type) {
    case 'new':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" stroke="#ebdcb9" strokeWidth="3" fill="none" strokeDasharray="6 6" className="opacity-40" />
        </svg>
      );
    case 'waxing-crescent':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="#ebdcb9">
          <path d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A30 40 0 0 0 50 10 Z" />
        </svg>
      );
    case 'first-quarter':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="#ebdcb9">
          <path d="M50 10 A40 40 0 0 1 50 90 Z" />
          <circle cx="50" cy="50" r="40" stroke="#ebdcb9" strokeWidth="3" fill="none" />
        </svg>
      );
    case 'waxing-gibbous':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="#ebdcb9">
          <path d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A18 40 0 0 1 50 10 Z" />
        </svg>
      );
    case 'full':
      return (
        <svg className={`${baseClass} animate-pulse`} viewBox="0 0 100 100" fill="#ebdcb9">
          <circle cx="50" cy="50" r="40" />
        </svg>
      );
    case 'waning-gibbous':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="#ebdcb9">
          <path d="M50 10 A40 40 0 0 0 10 50 A40 40 0 0 0 50 90 A18 40 0 0 0 50 10 Z" />
        </svg>
      );
    case 'third-quarter':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="#ebdcb9">
          <path d="M50 10 A40 40 0 0 0 50 90 Z" />
          <circle cx="50" cy="50" r="40" stroke="#ebdcb9" strokeWidth="3" fill="none" />
        </svg>
      );
    case 'waning-crescent':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="#ebdcb9">
          <path d="M50 10 A40 40 0 0 0 10 50 A40 40 0 0 0 50 90 A30 40 0 0 1 50 10 Z" />
        </svg>
      );
    default:
      return null;
  }
};

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({ activeKey }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const coverImageWatch = Form.useWatch('coverImage', form);
  const imageUrlWatch = Form.useWatch('image_url', form);
  const photoImageUrlWatch = Form.useWatch('imageUrl', form);
  const issueMainImageWatch = Form.useWatch('main_image', form);
  const reviewPosterUrlWatch = Form.useWatch('poster_url', form);

  const pageTitles = {
    bio: { cn: '个人自述维护', en: 'PERSONAL BIO MANAGER' },
    moons: { cn: '今日月相管理', en: 'LUNAR PHASES MANAGER' },
    photos: { cn: '摄影画廊管理', en: 'PHOTO ITEMS MANAGER' },
    issues: { cn: '杂志期刊管理', en: 'MAGAZINE ISSUES' },
    reviews: { cn: '艺术展评管理', en: 'EXHIBITION REVIEWS' },
    footprints: { cn: '足迹定点管理', en: 'TRACE MAP POINTS' },
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeKey === 'bio') {
        const bioData = await api.getBio();
        setData(bioData ? [bioData] : []);
        if (bioData) {
          form.setFieldsValue({
            name: bioData.name,
            nameEn: bioData.name_en,
            title: bioData.title,
            motto: bioData.motto,
            introParagraphsText: bioData.intro_paragraphs?.join('\n') || '',
            coverImage: bioData.cover_image
          });
        }
      } else if (activeKey === 'moons') {
        const moons = await api.getMoonPhases();
        setData(moons || []);
      } else if (activeKey === 'photos') {
        const photos = await api.getPhotos();
        setData(photos || []);
      } else if (activeKey === 'issues') {
        const issues = await api.getIssues();
        setData(issues || []);
      } else if (activeKey === 'reviews') {
        const reviews = await api.getExhibitions();
        setData(reviews || []);
      } else if (activeKey === 'footprints') {
        const footprints = await api.getFootprints();
        setData(footprints || []);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.resetFields();
    loadData();
  }, [activeKey]);

  const getUploadProps = (fieldName: string) => {
    const token = localStorage.getItem('admin_token');
    return {
      name: 'file',
      action: `${API_ORIGIN}/api/upload`,
      headers: {
        Authorization: `Bearer ${token}` || ''
      },
      showUploadList: false,
      onChange(info: any) {
        if (info.file.status === 'uploading') {
          messageApi.loading({ content: '正在极速本地化上传图片...', key: 'img_upload' });
          return;
        }
        if (info.file.status === 'done') {
          // 后端统一返回信封 { code, message, data }；接口恒为 HTTP 200，
          // 因此即便业务失败 antd 也会判定为 done，需手动按 code 判定成败。
          const resp = info.file.response;
          if (resp && resp.code === 200 && resp.data?.url) {
            // 数据库只存后端返回的相对路径（/static/uploads/...），
            // 展示时由 resolveAssetUrl 统一按环境补齐来源，保证存储格式一致。
            form.setFieldValue(fieldName, resp.data.url);
            messageApi.success({ content: '上传并本地化成功！', key: 'img_upload', duration: 1.5 });
          } else {
            messageApi.error({ content: resp?.message || '上传失败，请检查图片格式或体积(≤10M)', key: 'img_upload', duration: 2 });
          }
        } else if (info.file.status === 'error') {
          messageApi.error({ content: '上传失败，请检查登录凭证或网络连接', key: 'img_upload', duration: 2 });
        }
      },
    };
  };

  const onSave = async (values: any) => {
    const token = localStorage.getItem('admin_token');
    try {
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      if (activeKey === 'bio') {
        await request('/admin/bio', {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({
            name: values.name,
            name_en: values.nameEn,
            title: values.title,
            motto: values.motto,
            intro_paragraphs: values.introParagraphsText ? values.introParagraphsText.split('\n') : [],
            cover_image: values.coverImage
          })
        });
        api.clearBioCache();
        messageApi.success('个人信息更新成功！');
      } else if (activeKey === 'moons') {
        await request('/admin/moon-phases', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            id: values.id || undefined,
            name: values.name,
            english_name: values.english_name,
            keywords: values.keywords,
            suitable: values.suitable,
            tip: values.tip,
            image_url: values.image_url,
            sort_order: Number(values.sort_order || 8)
          })
        });
        messageApi.success('今日月相更新成功！');
      } else if (activeKey === 'photos') {
        await request('/admin/photos', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            id: values.id || undefined,
            title: values.title,
            category: values.category,
            location: values.location,
            date: values.date ? values.date.format('YYYY-MM-DD') : null,
            image_url: values.imageUrl,
            description: values.description
          })
        });
        messageApi.success('摄影画谱新增成功！');
      } else if (activeKey === 'issues') {
        await request('/admin/issues', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            id: values.id || undefined,
            title: values.title,
            issue_no: values.issue_no,
            issue_title: values.issue_title,
            subtitle: values.subtitle,
            date: values.date ? values.date.format('YYYY-MM-DD') : null,
            main_image: values.main_image,
            summary: values.summary,
            text_content: values.text_content,
            wechat_link: values.wechat_link,
            tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            articles: values.articles || [] // 级联传递动态拓展的子文章目录
          })
        });
        messageApi.success('杂志期刊保存成功！');
      } else if (activeKey === 'reviews') {
        await request('/admin/exhibitions', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            id: values.id || undefined,
            title: values.title,
            subtitle: values.subtitle,
            artist: values.artist,
            gallery_name: values.gallery_name,
            date: values.date ? values.date.format('YYYY-MM-DD') : null,
            rating: Number(values.rating || 5),
            review_text: values.review_text,
            poster_url: values.poster_url
          })
        });
        messageApi.success('艺术展评新增成功！');
      } else if (activeKey === 'footprints') {
        await request('/admin/footprints', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            id: values.id || undefined,
            city: values.city,
            city_en: values.city_en,
            country: values.country,
            location: values.location,
            lat: values.lat !== undefined && values.lat !== '' ? Number(values.lat) : null,
            lng: values.lng !== undefined && values.lng !== '' ? Number(values.lng) : null,
            date: values.date ? values.date.format('YYYY-MM-DD') : null,
            image_url: values.image_url,
            description: values.description,
            region: values.region
          })
        });
        messageApi.success('足迹定点新增成功！');
      }
      setDrawerVisible(false);
      loadData();
    } catch (err: any) {
      messageApi.error(err.message);
    }
  };

  const onDelete = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    const apiPathMap = {
      moons: 'moon-phases',
      issues: 'issues',
      reviews: 'exhibitions',
      photos: 'photos',
      footprints: 'footprints'
    };
    const path = apiPathMap[activeKey as keyof typeof apiPathMap];
    if (!path) return;
    
    try {
      await request(`/admin/${path}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      messageApi.success('数据已成功物理移除！');
      loadData();
    } catch (err: any) {
      messageApi.error(err.message);
    }
  };

  // 月相上移/下移：在当前顺序中与相邻行交换，按新顺序整体重置 sort_order 并刷新
  const moveMoon = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= data.length) return;
    const reordered = [...data];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const token = localStorage.getItem('admin_token');
    try {
      await request('/admin/moon-phases/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ordered_ids: reordered.map((m: any) => m.id) })
      });
      messageApi.success('月相排序已更新');
      loadData();
    } catch (err: any) {
      messageApi.error(err.message || '排序更新失败');
    }
  };

  const columns = activeKey === 'bio' ? [
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '外文名', dataIndex: 'name_en', key: 'name_en', align: 'center' },
    { title: '座右铭', dataIndex: 'motto', key: 'motto', align: 'center' },
    { title: '介绍段数', dataIndex: 'intro_paragraphs', key: 'intro_paragraphs', align: 'center', render: (val: any) => val?.length || 0 },
    {
      title: '操作', key: 'action', align: 'center', render: (_: any, record: any) => (
        <Button 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => {
            setEditingItem(record);
            form.setFieldsValue({
              name: record.name,
              nameEn: record.name_en,
              title: record.title,
              motto: record.motto,
              introParagraphsText: record.intro_paragraphs?.join('\n') || '',
              coverImage: record.cover_image
            });
            setDrawerVisible(true);
          }}
        >
          编辑 / EDIT
        </Button>
      )
    }
  ] : activeKey === 'moons' ? [
    { title: '序号', key: 'index', render: (_1: any, _2: any, index: number) => index + 1, width: 80, align: 'center' },
    { 
      title: '月相图像', 
      dataIndex: 'image_url', 
      key: 'image_url', 
      width: 100,
      align: 'center',
      render: (url: string) => (
        <div className="border border-[#e8e2d8] p-0.5 bg-white shadow-sm w-12 h-12 flex items-center justify-center mx-auto overflow-hidden">
          {url ? (
            <img src={resolveAssetUrl(url)} alt="Moon Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[9px] text-[#8c8273]/40">无图</span>
          )}
        </div>
      )
    },
    { title: '月相名称', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '英文名称', dataIndex: 'english_name', key: 'english_name', align: 'center' },
    { title: '核心词', dataIndex: 'keywords', key: 'keywords', align: 'center' },
    { title: '适宜行动', dataIndex: 'suitable', key: 'suitable', align: 'center' },
    {
      title: '操作', key: 'action', align: 'center', render: (_: any, record: any, index: number) => (
        <Space size="small">
          <Button
            type="link"
            icon={<ArrowUpOutlined />}
            disabled={index === 0}
            title="上移"
            onClick={() => moveMoon(index, -1)}
          />
          <Button
            type="link"
            icon={<ArrowDownOutlined />}
            disabled={index === data.length - 1}
            title="下移"
            onClick={() => moveMoon(index, 1)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue({
                id: record.id,
                name: record.name,
                english_name: record.english_name,
                keywords: record.keywords,
                suitable: record.suitable,
                tip: record.tip,
                image_url: record.image_url,
                sort_order: record.sort_order
              });
              setDrawerVisible(true);
            }}
          >
            编辑 / EDIT
          </Button>
          <Popconfirm
            title="确定要删除此个月相阶段吗？"
            description="删除后该月相将从系统彻底移除，前台将不再展示该周期。"
            onConfirm={() => onDelete(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除 / DELETE
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ] : activeKey === 'issues' ? [
    { title: '序号', key: 'index', render: (_1: any, _2: any, index: number) => index + 1, width: 70, align: 'center' },
    { title: '期数', dataIndex: 'issue_no', key: 'issue_no', width: 90, align: 'center' },
    { title: '主题', dataIndex: 'issue_title', key: 'issue_title', width: 80, align: 'center' },
    { title: '标题', dataIndex: 'title', key: 'title', width: 130, ellipsis: true, align: 'center' },
    { 
      title: '简述', 
      dataIndex: 'summary', 
      key: 'summary', 
      width: 100,
      align: 'center',
      render: (text: string) => (
        <div className="max-w-[100px] truncate block mx-auto text-center" title={text}>
          {text}
        </div>
      )
    },
    { title: '发布日期', dataIndex: 'date', key: 'date', width: 110, align: 'center' },
    {
      title: '操作', key: 'action', width: 160, fixed: 'right', align: 'center', render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue({
                id: record.id,
                title: record.title,
                issue_no: record.issue_no,
                issue_title: record.issue_title,
                subtitle: record.subtitle,
                date: record.date ? dayjs(record.date) : null,
                summary: record.summary,
                text_content: record.text_content,
                wechat_link: record.wechat_link,
                tags: record.tags?.join(', ') || '',
                main_image: record.main_image,
                articles: record.articles || []
              });
              setDrawerVisible(true);
            }}
          >
            编辑 / EDIT
          </Button>
          <Popconfirm
            title="确定要删除此期杂志吗？"
            description="删除后该期刊及其关联的所有子文章正文将物理清空，无法恢复。"
            onConfirm={() => onDelete(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除 / DELETE
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ] : activeKey === 'reviews' ? [
    { title: '序号', key: 'index', render: (_1: any, _2: any, index: number) => index + 1, width: 80, align: 'center' },
    { title: '展览名称', dataIndex: 'title', key: 'title', align: 'center' },
    { title: '艺术家', dataIndex: 'artist', key: 'artist', align: 'center' },
    { title: '展馆', dataIndex: 'gallery_name', key: 'gallery_name', align: 'center' },
    { title: '日期', dataIndex: 'date', key: 'date', align: 'center' },
    {
      title: '操作', key: 'action', align: 'center', render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue({
                id: record.id,
                title: record.title,
                subtitle: record.subtitle,
                artist: record.artist,
                gallery_name: record.gallery_name,
                date: record.date ? dayjs(record.date) : null,
                rating: record.rating,
                review_text: record.review_text,
                poster_url: record.poster_url
              });
              setDrawerVisible(true);
            }}
          >
            编辑 / EDIT
          </Button>
          <Popconfirm
            title="确定要删除此篇展评吗？"
            description="删除后该展评的所有字迹和记录将物理移除。"
            onConfirm={() => onDelete(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除 / DELETE
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ] : activeKey === 'footprints' ? [
    { title: '序号', key: 'index', render: (_1: any, _2: any, index: number) => index + 1, width: 80, align: 'center' },
    { title: '城市', dataIndex: 'city', key: 'city', align: 'center' },
    { title: '国家', dataIndex: 'country', key: 'country', align: 'center' },
    { title: '区域', dataIndex: 'region', key: 'region', align: 'center' },
    { title: '坐标', key: 'coords', align: 'center', render: (_: any, r: any) => `(${r.x}, ${r.y})` },
    {
      title: '操作', key: 'action', align: 'center', render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue({
                id: record.id,
                city: record.city,
                city_en: record.city_en,
                country: record.country,
                location: record.location,
                lat: record.lat,
                lng: record.lng,
                date: record.date ? dayjs(record.date) : null,
                image_url: record.image_url,
                description: record.description,
                region: record.region
              });
              setDrawerVisible(true);
            }}
          >
            编辑 / EDIT
          </Button>
          <Popconfirm
            title="确定要删除此个足迹坐标点吗？"
            description="删除后足迹地图上的此对应亮点将自动暗淡消失。"
            onConfirm={() => onDelete(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除 / DELETE
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ] : [
    { title: '序号', key: 'index', render: (_1: any, _2: any, index: number) => index + 1, width: 80, align: 'center' },
    { title: '标题', dataIndex: 'title', key: 'title', align: 'center' },
    { title: '分类', dataIndex: 'category', key: 'category', align: 'center' },
    { title: '拍摄地', dataIndex: 'location', key: 'location', align: 'center' },
    { title: '日期', dataIndex: 'date', key: 'date', align: 'center' },
    {
      title: '操作', key: 'action', align: 'center', render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue({
                id: record.id,
                title: record.title,
                category: record.category,
                location: record.location,
                date: record.date ? dayjs(record.date) : null,
                imageUrl: record.image_url,
                description: record.description
              });
              setDrawerVisible(true);
            }}
          >
            编辑 / EDIT
          </Button>
          <Popconfirm
            title="确定要删除此幅摄影作品吗？"
            description="删除后画谱摄影墙上的对应相框将下架消失。"
            onConfirm={() => onDelete(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除 / DELETE
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="bg-[#fffdfa] rounded-none w-full">
      {contextHolder}
      <div className="flex items-center justify-between mb-8 border-b border-[#e8e2d8]/50 pb-6 w-full">
        <div>
          <h2 className="text-xl font-light tracking-[0.2em] text-[#2c2722]">{pageTitles[activeKey].cn}</h2>
          <p className="text-[10px] text-[#8c8273] tracking-widest mt-1">{pageTitles[activeKey].en}</p>
        </div>
        
        {activeKey !== 'bio' && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setDrawerVisible(true);
            }}
            className="h-10 text-xs tracking-widest font-medium"
          >
            添加内容 / ADD
          </Button>
        )}
      </div>

      {activeKey === 'bio' ? (
        <div className="max-w-4xl mx-auto border border-[#e8e2d8] p-10 md:p-12 bg-[#fffdfa] shadow-[0_4px_24px_rgba(44,39,34,0.03)] font-serif w-full">
          <Form 
            layout="vertical" 
            form={form} 
            onFinish={onSave} 
            requiredMark={false}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="姓名 / Name" name="name" rules={[{ required: true, message: '姓名不能为空' }]}>
                <Input className="h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" />
              </Form.Item>
              <Form.Item label="外文名 / Name EN" name="nameEn">
                <Input className="h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="头衔 / Title" name="title">
                <Input className="h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" />
              </Form.Item>
              <Form.Item label="座右铭 / Motto" name="motto">
                <Input className="h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" />
              </Form.Item>
            </div>

            <Form.Item label="自我介绍多段落 (换行分隔)" name="introParagraphsText">
              <Input.TextArea rows={10} className="rounded-none bg-[#fdfcf9] border-[#e8e2d8] text-sm md:text-base leading-relaxed p-4" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <Form.Item label="封面图片 / Cover Image" required>
                  <Upload {...getUploadProps('coverImage')}>
                    <Button 
                      icon={<UploadOutlined />} 
                      className="h-11 cursor-pointer rounded-none border-[#e8e2d8] bg-[#fdfcf9] hover:text-[#2c2722] hover:border-brand-gold w-full text-left flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-medium"
                    >
                      上传本地封面图片 / UPLOAD LOCAL COVER
                    </Button>
                  </Upload>
                  {/* Keep the actual link in a hidden form item so Form can save it on finish */}
                  <Form.Item name="coverImage" noStyle>
                    <Input type="hidden" />
                  </Form.Item>
                </Form.Item>
              </div>
              <div className="md:col-span-4 flex justify-center">
                {coverImageWatch && (
                  <div className="border border-[#e8e2d8] p-1 bg-white shadow-sm max-w-full relative group overflow-hidden">
                    <img 
                      src={resolveAssetUrl(coverImageWatch)}
                      alt="Cover Preview" 
                      className="h-20 w-auto object-cover max-w-full"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <div 
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer" 
                      onClick={() => form.setFieldValue('coverImage', '')}
                    >
                      <span className="text-[10px] text-white tracking-widest font-sans font-medium">清除图片</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e8e2d8]/50">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="px-8 h-12 text-xs tracking-widest font-medium uppercase rounded-none bg-[#2c2722] hover:bg-[#ebdcb9] hover:text-[#2c2722]"
              >
                保存个人自述修改 / SAVE CHANGES
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading} 
          pagination={false}
          className="border border-[#e8e2d8] rounded-none shadow-sm w-full"
          scroll={{ x: 'max-content' }}
          tableLayout="fixed"
        />
      )}

      <Modal
        title={<span className="font-serif tracking-widest text-sm font-light text-[#2c2722]">内容创作画幅</span>}
        width={720}
        onCancel={() => setDrawerVisible(false)}
        open={drawerVisible}
        footer={null}
        destroyOnHidden
        className="font-serif rounded-none"
      >
        <Form layout="vertical" form={form} onFinish={onSave} requiredMark={false}>
          {activeKey === 'bio' && (
            <>
              <Form.Item label="姓名 / Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="外文名 / Name EN" name="nameEn">
                <Input />
              </Form.Item>
              <Form.Item label="头衔 / Title" name="title">
                <Input />
              </Form.Item>
              <Form.Item label="座右铭 / Motto" name="motto">
                <Input />
              </Form.Item>
              <Form.Item label="自我介绍多段落 (换行分隔)" name="introParagraphsText">
                <Input.TextArea rows={6} />
              </Form.Item>
              <Form.Item label="封面图片 / Cover Image Link" name="coverImage">
                <Space.Compact className="w-full">
                  <Input placeholder="可在此直接粘贴外链或点击右侧上传" />
                  <Upload {...getUploadProps('coverImage')}>
                    <Button icon={<UploadOutlined />} className="h-10 cursor-pointer">上传</Button>
                  </Upload>
                </Space.Compact>
              </Form.Item>
            </>
          )}

          {activeKey === 'moons' && (
            <>
              {/* Keep system/ID values in hidden inputs */}
              <Form.Item name="id" noStyle><Input type="hidden" /></Form.Item>
              <Form.Item name="sort_order" noStyle><Input type="hidden" /></Form.Item>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="月相中文名称 / Name" name="name" rules={[{ required: true, message: '请填写月相中文名称' }]}>
                  <Input placeholder="例如: 新月" />
                </Form.Item>
                <Form.Item label="月相英文名称 / English Name" name="english_name" rules={[{ required: true, message: '请填写月相英文名称' }]}>
                  <Input placeholder="例如: New Moon" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-4 mb-4">
                <div className="md:col-span-8">
                  <Form.Item label="月相美学配图 / Lunar Image" required>
                    <Upload {...getUploadProps('image_url')}>
                      <Button 
                        icon={<UploadOutlined />} 
                        className="h-11 cursor-pointer rounded-none border-[#e8e2d8] bg-[#fdfcf9] hover:text-[#2c2722] hover:border-brand-gold w-full text-left flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-medium"
                      >
                        上传本地月相美照 / UPLOAD IMAGE
                      </Button>
                    </Upload>
                    <Form.Item name="image_url" noStyle rules={[{ required: true, message: '请上传月相图片' }]}>
                      <Input type="hidden" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  {imageUrlWatch && (
                    <div className="border border-[#e8e2d8] p-1 bg-white shadow-sm max-w-full relative group overflow-hidden h-20 w-20 flex items-center justify-center">
                      <img 
                        src={resolveAssetUrl(imageUrlWatch)} 
                        alt="Moon Preview" 
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <div 
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer" 
                        onClick={() => form.setFieldValue('image_url', '')}
                      >
                        <span className="text-[10px] text-white tracking-widest font-sans font-medium">清除图片</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Form.Item label="核心关键字词 (、分隔)" name="keywords" rules={[{ required: true, message: '请填写关键字词' }]}>
                <Input placeholder="例如: 开始、设定、种子" />
              </Form.Item>
              
              <Form.Item label="月相适宜推行行动" name="suitable" rules={[{ required: true, message: '请填写适宜推行行动' }]}>
                <Input placeholder="例如: 写目标、定方向、整理愿望清单" />
              </Form.Item>
              
              <Form.Item label="写给自己的自省月相寄语" name="tip" rules={[{ required: true, message: '请填写自勉寄语' }]}>
                <Input.TextArea rows={4} placeholder="今日月相温馨启示字句..." />
              </Form.Item>
            </>
          )}

          {activeKey === 'photos' && (
            <>
              <Form.Item name="id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item label="作品名称 / Title" name="title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="艺术分类 / Category" name="category" rules={[{ required: true }]}>
                <Input placeholder="草木 | 景观 | 城市 | 静物" />
              </Form.Item>
              <Form.Item label="拍摄地点 / Location" name="location">
                <Input />
              </Form.Item>
              <Form.Item label="创作时间 / Date" name="date" rules={[{ required: true, message: '请选择创作时间' }]}>
                <DatePicker className="w-full h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" placeholder="选择摄影日期" />
              </Form.Item>
              <Form.Item label="艺术诗意描述 / Description" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-4">
                <div className="md:col-span-8">
                  <Form.Item label="摄影作品原片 (本地化上传)" required>
                    <Upload {...getUploadProps('imageUrl')}>
                      <Button 
                        icon={<UploadOutlined />} 
                        className="h-11 cursor-pointer rounded-none border-[#e8e2d8] bg-[#fdfcf9] hover:text-[#2c2722] hover:border-brand-gold w-full text-left flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-medium"
                      >
                        上传本地原片图片 / UPLOAD PHOTOGRAPHY
                      </Button>
                    </Upload>
                    <Form.Item name="imageUrl" noStyle rules={[{ required: true, message: '请上传摄影作品原片' }]}>
                      <Input type="hidden" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  {photoImageUrlWatch && (
                    <div className="border border-[#e8e2d8] p-1 bg-white shadow-sm max-w-full relative group overflow-hidden h-20 w-20 flex items-center justify-center">
                      <img 
                        src={resolveAssetUrl(photoImageUrlWatch)} 
                        alt="Photo Preview" 
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <div 
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer" 
                        onClick={() => form.setFieldValue('imageUrl', '')}
                      >
                        <span className="text-[10px] text-white tracking-widest font-sans font-medium">清除图片</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeKey === 'issues' && (
            <>
              <Form.Item name="id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item label="期刊标题 / Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="例如: 青 Azure" />
              </Form.Item>
              <Form.Item label="期数 / Issue No" name="issue_no" rules={[{ required: true }]}>
                <Input placeholder="例如: 第三期" />
              </Form.Item>
              <Form.Item label="主题 / Issue Title" name="issue_title" rules={[{ required: true }]}>
                <Input placeholder="例如: 青" />
              </Form.Item>
              <Form.Item label="宣传副标 / Subtitle" name="subtitle">
                <Input placeholder="例如: 万物始于幽暗，又归于初晖" />
              </Form.Item>
              <Form.Item label="发布时间 / Date" name="date" rules={[{ required: true, message: '请选择发布时间' }]}>
                <DatePicker className="w-full h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" placeholder="选择发布日期" />
              </Form.Item>
              <Form.Item label="简述 / Summary" name="summary">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item label="诗意正文 / Text Content" name="text_content">
                <Input.TextArea rows={5} />
              </Form.Item>
              <Form.Item label="微信推文链接 / WeChat Link" name="wechat_link">
                <Input placeholder="https://mp.weixin.qq.com/..." />
              </Form.Item>
              <Form.Item label="标签 (英文逗号分隔)" name="tags">
                <Input placeholder="例如: 青涩, 极简, 纯净" />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-4">
                <div className="md:col-span-8">
                  <Form.Item label="主图封面 (本地化上传)" required>
                    <Upload {...getUploadProps('main_image')}>
                      <Button 
                        icon={<UploadOutlined />} 
                        className="h-11 cursor-pointer rounded-none border-[#e8e2d8] bg-[#fdfcf9] hover:text-[#2c2722] hover:border-brand-gold w-full text-left flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-medium"
                      >
                        上传本地主图封面 / UPLOAD COVER
                      </Button>
                    </Upload>
                    <Form.Item name="main_image" noStyle rules={[{ required: true, message: '请上传主图封面' }]}>
                      <Input type="hidden" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  {issueMainImageWatch && (
                    <div className="border border-[#e8e2d8] p-1 bg-white shadow-sm max-w-full relative group overflow-hidden h-20 w-20 flex items-center justify-center">
                      <img 
                        src={resolveAssetUrl(issueMainImageWatch)} 
                        alt="Issue Cover Preview" 
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <div 
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer" 
                        onClick={() => form.setFieldValue('main_image', '')}
                      >
                        <span className="text-[10px] text-white tracking-widest font-sans font-medium">清除图片</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dynamic articles/directory list expansion */}
              <div className="border-t border-[#e8e2d8] my-8 pt-6">
                <h4 className="text-xs font-serif font-semibold tracking-widest text-[#2c2722] mb-4">
                  期刊目录与文章动态拓展 / DYNAMIC DIRECTORIES
                </h4>
                
                <Form.List name="articles">
                  {(fields, { add, remove }) => (
                    <div className="space-y-4">
                      {fields.map(({ key, name, ...restField }) => (
                        <div 
                          key={key} 
                          className="border border-[#e8e2d8] p-4 bg-[#fdfcf9] relative group/item"
                        >
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => remove(name)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-sans text-xs cursor-pointer z-10"
                          >
                            移除目录
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <Form.Item
                              {...restField}
                              name={[name, 'title']}
                              label="目录标题"
                              rules={[{ required: true, message: '请填写目录标题' }]}
                            >
                              <Input placeholder="例如: 青之悟" className="rounded-none bg-white h-10 border-[#e8e2d8]" />
                            </Form.Item>
                            
                            <Form.Item
                              {...restField}
                              name={[name, 'subtitle']}
                              label="副标题"
                            >
                              <Input placeholder="例如: 听一朵莲开的声音" className="rounded-none bg-white h-10 border-[#e8e2d8]" />
                            </Form.Item>
                          </div>
                          
                          <Form.Item
                            {...restField}
                            name={[name, 'content']}
                            label="文章详细正文 (支持换行)"
                            rules={[{ required: true, message: '请填写正文内容' }]}
                          >
                            <Input.TextArea rows={4} placeholder="正文诗意叙述..." className="rounded-none bg-white border-[#e8e2d8]" />
                          </Form.Item>
                          
                          {/* Hidden ID and Sort Order fields */}
                          <Form.Item name={[name, 'id']} noStyle><Input type="hidden" /></Form.Item>
                          <Form.Item name={[name, 'sort_order']} noStyle><Input type="hidden" /></Form.Item>
                        </div>
                      ))}
                      
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                        className="h-10 border-dashed border-brand-gold/60 text-brand-dark hover:text-brand-gold hover:border-brand-gold cursor-pointer text-xs flex items-center justify-center gap-1.5"
                      >
                        增添一级子目录与文章 / ADD ARTICLE
                      </Button>
                    </div>
                  )}
                </Form.List>
              </div>
            </>
          )}

          {activeKey === 'reviews' && (
            <>
              <Form.Item name="id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item label="展览名称 / Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="例如: 重返寂静" />
              </Form.Item>
              <Form.Item label="展览副标 / Subtitle" name="subtitle">
                <Input placeholder="例如: 当代极简艺术展" />
              </Form.Item>
              <Form.Item label="艺术家 / Artist" name="artist">
                <Input placeholder="例如: 杉本博司" />
              </Form.Item>
              <Form.Item label="展馆名称 / Gallery" name="gallery_name">
                <Input placeholder="例如: 白立方画廊 White Cube" />
              </Form.Item>
              <Form.Item label="观展时间 / Date" name="date" rules={[{ required: true, message: '请选择观展时间' }]}>
                <DatePicker className="w-full h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" placeholder="选择观展日期" />
              </Form.Item>
              <Form.Item label="推荐指数 / Rating" name="rating">
                <Input placeholder="5.0" />
              </Form.Item>
              <Form.Item label="诗意随笔 / Review Text" name="review_text" rules={[{ required: true }]}>
                <Input.TextArea rows={6} />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-4">
                <div className="md:col-span-8">
                  <Form.Item label="展评海报 (本地化上传)" required>
                    <Upload {...getUploadProps('poster_url')}>
                      <Button 
                        icon={<UploadOutlined />} 
                        className="h-11 cursor-pointer rounded-none border-[#e8e2d8] bg-[#fdfcf9] hover:text-[#2c2722] hover:border-brand-gold w-full text-left flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-medium"
                      >
                        上传本地展评海报 / UPLOAD POSTER
                      </Button>
                    </Upload>
                    <Form.Item name="poster_url" noStyle rules={[{ required: true, message: '请上传展评海报' }]}>
                      <Input type="hidden" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  {reviewPosterUrlWatch && (
                    <div className="border border-[#e8e2d8] p-1 bg-white shadow-sm max-w-full relative group overflow-hidden h-20 w-20 flex items-center justify-center">
                      <img 
                        src={resolveAssetUrl(reviewPosterUrlWatch)} 
                        alt="Poster Preview" 
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <div 
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer" 
                        onClick={() => form.setFieldValue('poster_url', '')}
                      >
                        <span className="text-[10px] text-white tracking-widest font-sans font-medium">清除图片</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeKey === 'footprints' && (
            <>
              <Form.Item name="id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item label="城市名称 / City" name="city" rules={[{ required: true }]}>
                <Input placeholder="例如: 京都" />
              </Form.Item>
              <Form.Item label="城市英文 / City EN" name="city_en">
                <Input placeholder="例如: Kyoto" />
              </Form.Item>
              <Form.Item label="国家名称 / Country" name="country" rules={[{ required: true }]}>
                <Input placeholder="例如: 日本" />
              </Form.Item>
              <Form.Item label="定点地标 / Location" name="location">
                <Input placeholder="例如: 岚山" />
              </Form.Item>
              {/* 经纬度手动输入 */}
              <div className="grid grid-cols-2 gap-4">
                <Form.Item label="纬度 / Latitude" name="lat" rules={[{ required: true, message: '请输入纬度' }]}>
                  <Input type="number" step="any" placeholder="如 39.90" className="h-10 rounded-none" />
                </Form.Item>
                <Form.Item label="经度 / Longitude" name="lng" rules={[{ required: true, message: '请输入经度' }]}>
                  <Input type="number" step="any" placeholder="如 116.41" className="h-10 rounded-none" />
                </Form.Item>
              </div>

              <Form.Item label="足迹区域 / Region" name="region" rules={[{ required: true, message: '请填写足迹区域' }]}>
                <Input placeholder="华东 | 华北 | 华中 | 西北 | 大湾区 | 日本" className="h-10 rounded-none" />
              </Form.Item>
              <Form.Item label="足迹日期 / Date" name="date" rules={[{ required: true, message: '请选择旅程时间' }]}>
                <DatePicker className="w-full h-10 rounded-none bg-[#fdfcf9] border-[#e8e2d8]" placeholder="选择旅程日期" />
              </Form.Item>
              <Form.Item label="感悟文字 / Description" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-4">
                <div className="md:col-span-8">
                  <Form.Item label="代表图片 (本地化上传)" required>
                    <Upload {...getUploadProps('image_url')}>
                      <Button 
                        icon={<UploadOutlined />} 
                        className="h-11 cursor-pointer rounded-none border-[#e8e2d8] bg-[#fdfcf9] hover:text-[#2c2722] hover:border-brand-gold w-full text-left flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-medium"
                      >
                        上传本地代表图片 / UPLOAD IMAGE
                      </Button>
                    </Upload>
                    <Form.Item name="image_url" noStyle rules={[{ required: true, message: '请上传代表图片' }]}>
                      <Input type="hidden" />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  {imageUrlWatch && (
                    <div className="border border-[#e8e2d8] p-1 bg-white shadow-sm max-w-full relative group overflow-hidden h-20 w-20 flex items-center justify-center">
                      <img 
                        src={resolveAssetUrl(imageUrlWatch)} 
                        alt="Footprint Preview" 
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <div 
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer" 
                        onClick={() => form.setFieldValue('image_url', '')}
                      >
                        <span className="text-[10px] text-white tracking-widest font-sans font-medium">清除图片</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Form.Item className="mt-10">
            <Button type="primary" htmlType="submit" className="w-full h-11 text-xs tracking-widest font-medium uppercase">
              保存修改 / COMMIT & SAVE
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
