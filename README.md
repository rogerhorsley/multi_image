# AI 图像生成工具

基于 CloudBase 和 React 构建的多功能 AI 图像生成应用。

## 🚀 功能特性

### 核心功能
- **文生图** - 根据文本描述生成高质量图像
- **图生图** - 基于参考图像进行风格转换和变化
- **图生视频** - 将静态图像转换为动态视频

### 用户体验
- **简化参数配置** - 隐藏复杂技术参数，提供直观选项
  - 画面比例选择（正方形、标准、竖屏、宽屏等）
  - 生成质量档位（快速、标准、高质量）
  - 风格强度控制（轻微、适中、强烈）
  - 视频时长设置（3-10秒）

### 界面设计
- **现代化深色主题** - 渐变色彩，视觉效果佳
- **响应式布局** - 适配桌面和移动设备
- **直观操作流程** - 简单易用的交互设计

## 🛠️ 技术栈

- **前端框架**: React 18 + Vite
- **UI组件**: 自定义组件库 + Tailwind CSS 4.x
- **后端服务**: 腾讯云 CloudBase
- **云函数**: Node.js
- **数据库**: CloudBase 数据库
- **AI模型**: 支持多种主流模型
  - SeDream 4 (字节跳动)
  - FLUX Schnell (Black Forest Labs)
  - Imagen 4 Fast (Google)
  - Qwen Image (阿里巴巴)
  - Veo 3 Fast (Google视频)
  - SeDance 1 Pro (字节跳动视频)

## 📦 安装和运行

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd multi_image

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
# 浏览器打开 http://localhost:3001
```

### 构建部署
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🔧 配置说明

### CloudBase 配置
1. 在 `cloudbaserc.json` 中配置环境ID
2. 部署云函数到 CloudBase
3. 配置数据库权限

### 环境变量
创建 `.env` 文件：
```env
VITE_CLOUDBASE_ENV_ID=your-env-id
```

## 📁 项目结构

```
multi_image/
├── src/
│   ├── components/          # React 组件
│   │   ├── ui/             # 基础 UI 组件
│   │   ├── ModelSelector.jsx
│   │   ├── ParameterPanel.jsx
│   │   └── GenerationCard.jsx
│   ├── pages/              # 页面组件
│   │   ├── index.jsx       # 主页面
│   │   └── history.jsx     # 历史记录
│   ├── utils/              # 工具函数
│   │   ├── cloudbase.js    # CloudBase 集成
│   │   └── replicate.js    # AI 模型调用
│   └── configs/            # 配置文件
├── cloudfunctions/         # 云函数
│   └── generate_image/     # 图像生成函数
├── public/                 # 静态资源
└── package.json
```

## 🎯 使用指南

### 文生图模式
1. 选择图像生成模型
2. 输入详细的描述提示词
3. 调整画面比例和生成质量
4. 点击"生成图像"按钮

### 图生图模式
1. 上传参考图像
2. 输入风格描述或修改提示
3. 选择变化强度
4. 生成风格转换后的图像

### 图生视频模式
1. 上传静态图像
2. 描述期望的动作效果
3. 设置视频时长
4. 生成动态视频

## 📝 开发日志

### v1.0.0 (2025-01-15)
- ✅ 完成基础框架搭建
- ✅ 实现三种生成模式
- ✅ 简化参数配置系统
- ✅ 修复 Tailwind CSS 4.x 兼容性
- ✅ 优化用户界面和交互体验
- ✅ 集成 CloudBase 后端服务
- ✅ 添加历史记录功能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

MIT License

## 🔗 相关链接

- [腾讯云 CloudBase](https://cloud.tencent.com/product/tcb)
- [React 官方文档](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite 构建工具](https://vitejs.dev/)