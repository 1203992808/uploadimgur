# ImageUp - 现代化图床服务

基于 Next.js + TypeScript + Tailwind CSS 构建的现代化图床服务，通过 Imgur API 提供快速、免费的图片托管。

## 特性

- ✅ **快速上传**: 拖拽、点击、粘贴多种上传方式
- ✅ **实时预览**: 上传前预览和编辑
- ✅ **批量处理**: 支持同时上传多个文件
- ✅ **多种格式**: 支持直接链接、Markdown、HTML、BBCode
- ✅ **图片优化**: 自动压缩和格式转换
- ✅ **历史记录**: 本地存储上传历史
- ✅ **响应式设计**: 完美支持桌面和移动设备
- ✅ **暗黑模式**: 自动适配系统主题

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **图片处理**: Canvas API
- **状态管理**: React Hooks + localStorage

## 快速开始

### 安装依赖

```bash
npm install
# 或者
bun install
```

### 配置环境变量

创建 `.env.local` 文件：

```env
IMGUR_CLIENT_ID=你的imgur客户端ID
```

你可以在 [Imgur API](https://api.imgur.com/oauth2/addclient) 获取免费的客户端 ID。

### 启动开发服务器

```bash
npm run dev
# 或者
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/upload/        # 上传 API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   └── upload/           # 上传相关组件
├── lib/                  # 工具库
│   ├── api/             # API 调用
│   ├── image/           # 图片处理
│   ├── storage/         # 本地存储
│   └── utils/           # 通用工具
├── types/               # TypeScript 类型
├── hooks/               # 自定义 Hooks
└── constants/           # 常量定义
```

## 核心功能

### 上传功能

- 支持拖拽上传
- 支持点击选择文件
- 支持粘贴上传（Ctrl+V）
- 支持批量上传
- 实时显示上传进度

### 图片处理

- 自动压缩优化
- 格式转换（JPEG/PNG/WebP）
- 尺寸调整
- 质量控制

### 链接管理

- 直接链接
- Markdown 格式
- HTML 标签
- BBCode 格式
- 一键复制

### 历史记录

- 本地存储上传历史
- 缩略图预览
- 快速访问历史链接
- 历史记录管理

## 与 uploadimgur.com 的差异化优势

### 1. 用户体验优势
- **现代化界面**: 使用最新的设计语言
- **响应式设计**: 完美适配各种设备
- **实时反馈**: 详细的上传进度和状态
- **历史管理**: 本地保存上传记录

### 2. 功能优势
- **图片处理**: 内置压缩和优化功能
- **多种格式**: 更多的链接格式选择
- **批量操作**: 高效的批量上传和管理
- **智能预览**: 上传前预览功能

### 3. 技术优势
- **现代技术栈**: 使用最新的 Web 技术
- **类型安全**: TypeScript 确保代码质量
- **性能优化**: 代码分割和懒加载
- **PWA 支持**: 可安装为桌面应用

## 部署

### Vercel（推荐）

```bash
npm run build
# 或部署到 Vercel
vercel
```

### 其他平台

```bash
npm run build
npm start
```

## 环境要求

- Node.js 18+
- npm 或 bun

## 常见问题

### Q: 如何获取 Imgur Client ID？
A: 访问 [Imgur API](https://api.imgur.com/oauth2/addclient) 注册应用获取。

### Q: 支持哪些图片格式？
A: 支持 JPEG、PNG、GIF、WebP 格式。

### Q: 文件大小限制？
A: 单个文件最大 10MB。

### Q: 历史记录存储在哪里？
A: 历史记录存储在浏览器的 localStorage 中，不会上传到服务器。

## 许可证

MIT License
