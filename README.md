# 🌅 东方朗月 · Eastern Bright Moon
> **「月不催促花开，它只是安静地照着每一段生长。」**
> —— 东方雅致、极简主义的个人自省、月相计划与足迹心物大一统全栈系统。

![License](https://img.shields.io/badge/License-Apache_2.0-gold.svg)
![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![React](https://img.shields.io/badge/React-18+-lightblue.svg)
![Antd](https://img.shields.io/badge/Ant_Design-6.x-purple.svg)

---

## 🎐 项目版图介绍

**「东方朗月」** 是一款专为崇尚东方静谧美学、禅意留白的创意工作者与生活家打造的数字化自省、美学期刊以及足迹行记空间。系统采用前后台完全独立、全类型安全的现代化异步架构（FastAPI + React + MySQL），将前沿的响应式计算与宋体/衬线字形排版合而为一。

*   **🌙 月之谕 (Lunar Oracle)**：
    动态读取月轮阴影盈亏（新月、弯月、满月、残月），配有高拟真、发光的圆轮珍珠金卡片。内置**5 步递进式手抄本 Modal 计划生成器**，支持自省计划的物理草稿保留、羊皮纸质感生成输出。
*   **📖 书画与摄影 (Gallery & Reviews)**：
    高清水墨、青花调性作品画卷流，级联树状电子美学杂志期刊，配有诗意观展展评和推荐指数。
*   **🗺️ 寰宇足迹 (Trace Map)**：
    采用高度定制的可视化 **SVG 地图点选仪**。管理员可以在地图上点击任意一点，一键设定足迹亮点。前台则以扩散式呼吸雷达波（Ripple Radar）呈现行走天涯的亮点足迹。
*   **⛩️ 古典中正控制台 (Aesthetic CMS)**：
    后台摒弃了拥挤的左右排版，全部采用**黄金比例居中宽幅表单**。表格列宽精密锁定，配有**操作列右侧永久冻结（Freeze）固定**、全局横向响应式流式防溢出安全机制，并且所有图片上传均支持一键本地化上传与 Hover 置空动画。

---

## 🛠️ 后端启动指南（Python 虚拟环境）

后端采用 **FastAPI + SQLAlchemy 2.0 (Async) + Pydantic v2 + bcrypt** 搭建，数据库文件默认通过 **aiomysql** 驱动进行高性能异步读写，静态资源配有**时间轴自动归档（`static/uploads/YYYY-MM-DD/`）**机制。

### 1. 环境准备
确保您的物理机上已安装：
*   **Python 3.10+**
*   **MySQL 8.0+**
*   **Redis**（用于高安全 JWT 令牌废弃拉黑机制）

### 2. 使用虚拟环境 (Virtual Environment) 启动

为了防止全局 Python 依赖包产生版本冲突，我们**强烈建议并规定**使用虚拟环境（`venv`）进行隔离运行。

#### 🟢 第一步：创建 Python 虚拟环境
在项目根目录下，运行以下指令创建名为 `venv` 的虚拟环境文件夹：
```bash
python3 -m venv venv
```

#### 🟢 第二步：激活虚拟环境
根据您的操作系统，执行对应的激活命令：

*   **Linux / macOS (Bash / Zsh)**:
    ```bash
    source venv/bin/activate
    ```
*   **Windows (Command Prompt / CMD)**:
    ```cmd
    venv\Scripts\activate.bat
    ```
*   **Windows (PowerShell)**:
    ```powershell
    venv\Scripts\Activate.ps1
    ```

*激活成功后，您的终端提示符前方会多出 `(venv)` 字样，代表所有 Python 命令和依赖均已安全隔离。*

#### 🟢 第三步：极速安装后端依赖包
在激活的虚拟环境下，运行 pip 灌装所有精选的三方组件：
```bash
pip install -r backend/requirements.txt
```

#### 🟢 第四步：环境变量配置文件
1. 复制后端环境变量模板：
   ```bash
   cp backend/.env.example backend/.env
   ```
2. 编辑 `backend/.env`，将其中的数据库连接串（`DATABASE_URL`）及 Redis、JWT 密钥修改为您本机的配置。
   *注：本项目默认已无缝变轨接入了高规格远程分布式数据库网关。*

#### 🟢 第五步：一键运行后端 API 服务
直接运行主入口文件：
```bash
python backend/main.py
```
*   **服务地址**：`http://localhost:8998`
*   **在线 Swagger API 文档**：`http://localhost:8998/docs`

---

## 💻 前端启动指南（Node.js & React）

前端基于 **React 18 + Vite 5 + TypeScript + Tailwind CSS 3 + Motion 12 + Ant Design 6** 纯手工打造。

### 1. 极速灌装 Node 依赖
进入前端工作路径：
```bash
cd frontend
npm install
```

### 2. 运行前端本地开发服务器
一键拉起实时热重载开发环境：
```bash
npm run dev
```
*   **前台游客主页**：`http://localhost:2323`
*   **后台管理面板**：`http://localhost:2323/admin/dashboard`
    *   *默认初始管理员账户名*：`admin`
    *   *默认初始管理员密码*：`admin`

---

## 🗄️ 数据库 DDL 初始建表与种子灌装

如果您需要重新在本地离线导入或备份整个项目的 MySQL 数据库：
1. 建立空数据库：
   ```sql
   CREATE DATABASE IF NOT EXISTS `eastern` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. 在项目根目录下，执行一键 SQL 灌装导入：
   ```bash
   mysql -u [您的用户名] -p eastern < eastern.sql
   ```

---

## 🎋 美学与交互开发原则 (SPDX-License-Identifier)

如果您打算为「东方朗月」续写新的功能板块，请务必严守以下设计死理：

1.  **古典中正、极致留白**：
    *   主色调采用宣纸微茫色（`#fffdfa` | `#FAF7F2`）作为底盘，边框使用仿竹木刻线色（`#ebdcb9`/`#e8e2d8`），核心字体一律优先采用长长、秀美的 **Serif/宋体/衬线字形**。
2.  **严防内容溢出**：
    *   全局表格数据展现必须带有具体的 `width` 锁死，长文本数据格必须套接 `<div className="max-w-[100px] truncate block mx-auto text-center" title={text}>` CSS 物理级强制省略，且必须把最右侧的操作按钮（Edit / Delete）进行 `fixed: "right"` 右侧冻结固定，保证极窄分屏和 F12 调试下**主排版 100% 毫无错行溢出**。
3.  **零 RAW 文本外链输入**：
    *   全后台所有图片均支持一键本地化上传并自动归类，配合 Hover 悬浮置空清除提示，保持最高的现代用户体验手感。

---

## 📜 授权与许可
本项目采用 **Apache License 2.0** 开源授权许可。
> **「寻心之旅，不疾不徐。愿此间皎洁，能常伴您的笔墨余温。」**
