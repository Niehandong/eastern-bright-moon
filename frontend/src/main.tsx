import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';

const easternMoonTheme = {
  token: {
    colorPrimary: '#c5a880',       // 品牌主色：冷松金
    colorBgBase: '#fffdfa',        // 宣纸素白背景
    colorTextBase: '#2c2722',      // 炭黑字色
    borderRadius: 0,               // 彻底直角
    fontFamily: 'Georgia, "Songti SC", "SimSun", serif', // 优雅衬线宋体
  },
  components: {
    Button: {
      colorPrimary: '#c5a880',
      colorPrimaryHover: '#2c2722',
      colorLink: '#c5a880',
      colorLinkHover: '#2c2722',
    },
    Input: {
      activeBorderColor: '#c5a880',
    }
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={easternMoonTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
