# Architecture - Wordream

## 项目概述

**Wordream** 是一个基于 T3 Stack 的 AI 视频生成平台，帮助用户通过 AI 生成视频内容。用户可以描述一个想法或粘贴剧本，系统会自动构建场景、角色、镜头和配乐。

**项目路径**: `E:\Workspace\scary-video-generator-ai`  
**项目名称**: Wordream  
**创建时间**: 基于 create-t3-app (v7.37.0)  
**最后更新**: 2026-05-12 (移动端适配完成 + UI 样式统一化)

## 技术架构

### 核心技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.5 (严格模式)
- **后端**: Convex (实时后端 + NoSQL 数据库)
- **样式**: Tailwind CSS 3.4 + shadcn/ui + Radix UI
- **数据库**:
  - Convex (主数据库，NoSQL)
  - Drizzle ORM + MySQL (通过 Lucia Auth 使用)
- **认证**: Convex Auth + Lucia Auth
- **AI 服务**: OpenAI API, Replicate, Cloudinary
- **状态管理**: Convex hooks (useQuery/useMutation) + Zustand
- **验证**: Zod (@t3-oss/env-nextjs)

### 主题配色

使用紫色主题，贯穿整个应用：

| CSS 变量               | 值                                                     | 用途     |
| ---------------------- | ------------------------------------------------------ | -------- |
| `--primary`            | `272 72% 47%`                                          | 主色调   |
| `--primary-foreground` | `273 67% 39%`                                          | 主色文字 |
| Tailwind               | `purple-300`, `purple-400`, `purple-500`, `purple-700` | 页面元素 |

### 自定义字体

| 字体          | CSS 类         | 用途                 |
| ------------- | -------------- | -------------------- |
| Amatic SC     | `font-amatic`  | 大标题、手写风格     |
| Special Elite | `font-special` | 正文、按钮、卡片描述 |
| Jolly Lodger  | `font-jolly`   | Hero 区域描述文字    |
| Nosifer       | `font-nosifer` | 页面大标题、品牌名   |

### 关键依赖

```json
{
  "convex": "^1.16.2",
  "next": "^14.2.4",
  "react": "^18.3.1",
  "openai": "^4.65.0",
  "replicate": "^0.34.1",
  "cloudinary": "^2.5.0",
  "@radix-ui/react-*": "多个 Radix UI 组件",
  "lucide-react": "^0.429.0",
  "gsap": "^3.12.5"
}
```

## 项目结构详解

### 根目录配置文件

```
├── package.json          # 项目依赖和脚本
├── tsconfig.json         # TypeScript 配置（路径别名 @/* 和 ~/*）
├── next.config.js        # Next.js 配置（图片域名白名单）
├── tailwind.config.ts    # Tailwind 配置（自定义字体和主题）
├── .eslintrc.cjs         # ESLint 配置（TypeScript 严格检查）
├── prettier.config.js    # Prettier 配置（集成 tailwindcss 插件）
├── components.json       # shadcn/ui 配置
├── public/
│   ├── favicon.svg       # 网站 favicon
│   ├── logo.svg         # Logo 图标（已废弃，仅图标部分）
│   └── header-bg.jpg    # Hero 背景图片（已被 hero-canvas 替代）
└── src/env.js            # 环境变量验证（Zod）
```

### 源代码结构 (`src/`)

```
src/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（全局 providers、字体加载）
│   ├── page.tsx                  # 首页（重命名为 dashboard 风格）
│   ├── error.tsx                 # 错误处理页
│   ├── not-found.tsx             # 404 页面
│   ├── maintenance.tsx           # 维护页面
│   └── (required-auth)/          # 需要认证的路由组
│       ├── page.tsx              # 仪表盘首页
│       ├── _components/
│       │   ├── hero.tsx          # Hero 区域组件（使用 WebGL Canvas）
│       │   ├── hero-canvas.tsx    # WebGL Shader 背景动画
│       │   └── start-crapt-button.tsx  # 主按钮组件
│       ├── stories/              # 项目管理（已改为视频项目）
│       │   ├── page.tsx          # 项目列表
│       │   └── [storyId]/
│       │       ├── page.tsx      # 项目详情
│       │       └── refine/       # 项目优化页面
│       ├── videos/               # 视频管理
│       │   └── page.tsx          # 视频列表
│       └── generate/             # 生成功能
│           ├── page.tsx          # 生成入口
│           ├── script/           # 脚本生成
│           ├── segment/          # 片段生成
│           └── guided/           # 引导式生成
├── components/                   # React 组件
│   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── button.tsx            # 按钮（使用 cva）
│   │   ├── card.tsx              # 卡片
│   │   ├── dialog.tsx            # 对话框
│   │   ├── input.tsx             # 输入框
│   │   ├── select.tsx            # 下拉选择
│   │   ├── toast.tsx             # 提示消息
│   │   └── ...                  # 其他 20+ 组件
│   ├── stories/                  # 项目相关组件
│   │   ├── story-item.tsx        # 项目项展示
│   │   ├── story-menus.tsx       # 项目操作菜单
│   │   ├── segment-item.tsx      # 项目片段项
│   │   ├── refine-form.tsx       # 优化表单
│   │   └── image-prompt-form.tsx # 图片提示词表单
│   ├── videos/                   # 视频相关组件
│   │   ├── video-item.tsx        # 视频项
│   │   ├── upload-youtube-form.tsx
│   │   └── connect-youtube-button.tsx
│   ├── shared/                   # 共享组件
│   │   ├── loader.tsx            # 加载器
│   │   ├── footer.tsx            # 页脚（紫色主题）
│   │   ├── flicker-text.tsx       # 闪烁文字效果
│   │   └── custom-modal.tsx      # 自定义模态框
│   ├── header/                   # 头部组件
│   │   ├── header.tsx            # 主导航栏（Wordream 品牌）
│   │   └── menu-button.tsx
│   └── providers/                # Context Providers
│       ├── convex-client-provider.tsx
│       ├── global-providers.tsx
│       ├── theme-provider.tsx     # 暗黑模式
│       └── modal-provider.tsx
├── lib/                          # 工具函数库
│   ├── utils.ts                  # cn() 函数（clsx + tailwind-merge）
│   ├── calculate-credits.ts      # 积分计算
│   ├── names.ts                  # 名称生成
│   └── errors.ts                 # 错误处理
├── emails/                       # 邮件模板（React Email）
│   ├── verify-email.tsx
│   ├── reset-password.tsx
│   └── magic-link.tsqx
├── styles/                       # 全局样式
│   ├── globals.css               # Tailwind 基础样式、主题变量
│   ├── horror.css                # 闪烁效果 CSS（废弃）
│   └── common.tsx                # 通用样式
└── middleware.ts                 # Next.js 中间件
```

### Convex 后端 (`convex/`)

```
convex/
├── schema.ts             # 数据库 schema 定义
├── README.md             # Convex 使用说明
├── tsconfig.json         # Convex TypeScript 配置
├── _generated/           # 自动生成的类型（不要手动修改）
├── auth.config.ts        # Convex Auth 配置
├── auth.ts               # 认证逻辑
├── stories.ts            # 项目相关查询/变更
├── videos.ts             # 视频相关查询/变更
├── storySegments.ts      # 项目片段处理
├── videoSegments.ts      # 视频片段处理
├── chatgpt.ts            # OpenAI 集成
├── replicate.ts          # Replicate API 集成
├── cloudinary.ts         # Cloudinary 云存储
├── youtube.ts            # YouTube API 集成
├── images.ts             # 图片处理
├── voices.ts             # 语音合成
├── credits.ts            # 积分系统
├── channels.ts           # YouTube 频道
├── sqs.ts                # AWS SQS 消息队列
├── http.ts               # HTTP 端点
├── users.ts              # 用户管理
├── logs.ts               # 日志记录
└── storage.ts            # 存储配置
```

## 核心功能模块

### 1. 视频生成流程

```
用户输入 → AI 生成脚本 → 生成图片 → 生成语音 → 合成视频 → 上传 YouTube
```

- **入口**: `/generate/script`, `/generate/guided`, `/generate/segment`
- **核心文件**: `convex/stories.ts`, `convex/chatgpt.ts`
- **组件**: `src/components/stories/`

### 2. Guided 生成 (引导式脚本生成)

- **路径**: `/generate/guided`
- **功能**: 用户输入故事想法，选择目标时长和视觉风格，AI 生成专业剧本格式
- **参数**:
  - `targetDuration`: 目标时长 (15s/30s/1m/2m/3m)
  - `styleId`: 视觉风格 (15种预设)
- **输出格式**: 专业剧本格式 (场景标题、动作描述、角色对话、镜头指示)
- **后端**: `convex/chatgpt.ts` - `generateStory` action
- **UI 组件**: `src/app/(required-auth)/generate/guided/page.tsx`

#### 15 种视觉风格预设

| ID            | 名称              | 描述                           |
| ------------- | ----------------- | ------------------------------ |
| product-ad    | Product Ad        | Fresh, tactile product content |
| real-estate   | Real Estate       | Luxury property cinematography |
| animatic      | Animatic          | Storyboard pre-visualization   |
| corporate     | Corporate         | Clean professional visuals     |
| award-season  | Award Season      | Deep emotional storytelling    |
| documentary   | Documentary       | Natural observational style    |
| action        | Action            | High-energy dynamic visuals    |
| rom-com       | Rom-Com           | Warm bright cheerful style     |
| animated      | Animated          | Premium stylized animation     |
| neo-noir      | Neo-Noir          | Dark stylized thriller         |
| pastel        | Pastel            | Whimsical symmetrical pastels  |
| sci-fi        | Sci-Fi Futuristic | High-tech sleek designs        |
| horror-gothic | Horror Gothic     | Dark atmospheric horror        |
| western       | Western Epic      | Wide vistas golden hour        |
| lo-fi-retro   | Lo-Fi Retro       | Vintage smartphone aesthetic   |

#### 时长与场景数映射

| 时长 | 场景数       | 描述字数 |
| ---- | ------------ | -------- |
| 15s  | 2-4 scenes   | ~400 字  |
| 30s  | 4-6 scenes   | ~800 字  |
| 1m   | 8-12 scenes  | ~1500 字 |
| 2m   | 15-20 scenes | ~2500 字 |
| 3m   | 20-30 scenes | ~3500 字 |

### 3. 项目优化 (Refine)

- **路径**: `/stories/[storyId]/refine`
- **功能**: 修改项目内容、生成图片提示词、调整格式（16:9 或 9:16）
- **核心**: `convex/storySegments.ts`

### 4. 视频生成

- **流程**: 项目 → 生成语音 → 生成图片 → 合成视频 → 上传 YouTube
- **服务**:
  - 语音: `convex/voices.ts`
  - 图片: `convex/images.ts` (使用 Replicate)
  - 视频: `convex/videos.ts` (使用 Replicate)
  - 上传: `convex/youtube.ts`

### 5. YouTube 集成

- **功能**: 连接 YouTube 账号、上传视频、管理频道
- **组件**: `src/components/videos/connect-youtube-button.tsx`
- **后端**: `convex/youtube.ts`, `convex/channels.ts`

### 6. 积分系统

- **文件**: `convex/credits.ts`, `src/lib/calculate-credits.ts`
- **用途**: 控制用户使用 AI 生成功能的次数

## 设计系统

### 2026-05-12 UI 样式统一化更新

#### Header 和 Footer 统一

- **Header** (`src/components/header/header.tsx`): 保持无背景色，有底部边框线
- **Footer** (`src/components/shared/footer.tsx`): 无背景色，有顶部边框线
- 边框颜色: `border-purple-700`
- 文字颜色: `text-purple-300`
- 移除了 Footer 的版权区域上方的分隔线
- 桌面端导航链接悬停: `transition-colors hover:text-white`

#### 手机端菜单 (MenuButton)

- **文件**: `src/components/header/menu-button.tsx`
- Hamburger icon: `text-purple-300`
- 下拉菜单背景: `bg-gray-900`
- 菜单项文字: `text-purple-300`
- 悬停/聚焦效果: `hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white`
- Icon 颜色继承父元素，无需单独设置

#### User 下拉菜单样式

- 下拉菜单背景: `bg-gray-900`
- 文字颜色: `text-purple-300`
- 用户名字体: `DropdownMenuLabel` 加 `className="text-purple-300"`
- 退出按钮: `focus:bg-purple-700 focus:text-white`
- 移除了用户名和退出按钮之间的分隔线

#### Credits 显示

- 文字颜色: `text-purple-300`

#### Feature 卡片布局

- 布局: 水平排列（左图标 + 标题），下方描述
- 图标容器: `h-12 w-12 rounded-full bg-white/10`
- 图标大小: `h-5 w-5`
- 标题与描述间距: `mt-3`
- 网格: `md:grid-cols-3 lg:grid-cols-4`

### 移动端响应式规范

#### 字体响应式

- 页面大标题: `text-2xl md:text-[40px]` (Nosifer 字体)
- 副标题: `text-2xl md:text-4xl` (Amatic 字体)
- 正文描述: `text-base md:text-lg`

#### 间距响应式

- 表单容器: `p-4 md:p-8`
- Textarea 高度: `min-h-[200px] md:min-h-[300px]`
- 卡片最小高度: `min-h-[200px] md:min-h-[400px]`

#### 组件响应式

- 生成选项卡片: `h-40 w-full max-w-[200px] md:h-52 md:w-52 md:p-6`
- 网格布局: `grid-cols-1 md:grid-cols-* lg:grid-cols-*`

#### Videos 页面特殊处理

- 桌面端: Channels 信息浮动显示 (`float-right hidden md:block`)
- 移动端: Channels 信息独立区块显示 (`mt-8 border-t border-purple-700 pt-4 md:hidden`)

### 颜色规范

```css
/* 主色调 */
--primary: 272 72% 47% /* 紫色 */ --primary-foreground: 273 67% 39%
  /* 页面元素颜色 */ text-purple-300 /* 标题、品牌名 */ text-purple-400
  /* 次要文字 */ text-purple-500 /* 图标背景 */ text-purple-700 /* 边框 */
  /* 按钮样式 */ bg-primary text-white hover: bg-primary/90 /* 卡片样式 */
  bg-primary p-6 text-white hover: scale-105 hover: bg-primary/90;
```

### 字体规范

| 字体          | 类名           | 字号      | 用途             | 示例            |
| ------------- | -------------- | --------- | ---------------- | --------------- |
| Amatic SC     | `font-amatic`  | 24px-80px | 大标题           | `Wordream` Logo |
| Special Elite | `font-special` | sm-xl     | 正文、按钮、卡片 | 功能描述        |
| Jolly Lodger  | `font-jolly`   | lg-4xl    | Hero 描述        | 副标题          |
| Nosifer       | `font-nosifer` | 50px      | 页面大标题       | 区块标题        |

### 组件样式

#### 按钮

```tsx
// 主按钮
<Button variant="default" className="px-8 py-6 font-jolly text-[24px]">
  Start Creating Video
</Button>

// Google 登录按钮
<button className="flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
  <GoogleIcon className="mr-2 h-5 w-5" fill="white" />
  Sign In
</button>
```

#### Feature 卡片

```tsx
<Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="font-special text-xl font-bold text-white">Feature Title</h3>
  </div>
  <p className="mt-3 font-special text-gray-300">
    Feature description text goes here.
  </p>
</Card>
```

#### Header

```tsx
<Link href="/">
  <span className="font-nosifer text-2xl text-purple-300">Wordream</span>
</Link>

<Link className="font-amatic !text-[24px] !font-bold text-purple-300">
  Generate
</Link>
```

#### Footer

```tsx
<footer className="border-t border-purple-700 text-purple-200">
  <span className="font-nosifer text-xl text-purple-300">Wordream</span>
  <span className="font-special text-sm text-purple-300">Docs</span>
  <span className="font-special text-sm text-purple-300">Terms</span>
  <span className="font-special text-sm text-purple-300">Privacy</span>
  <p className="font-special text-sm text-purple-400">&copy; 2026 Wordream</p>
</footer>
```

### Hero 区域

- **背景**: WebGL Shader (`hero-canvas.tsx`) - 六边形网格动画
- **标题**: `font-amatic text-purple-300`
- **描述**: `font-jolly text-gray-300`
- **按钮**: `bg-primary text-white`

## 数据流和状态管理

### 服务端状态 (Convex)

```tsx
// 查询数据
const stories = useQuery(api.stories.getStories);

// 变更数据
const deleteStory = useMutation(api.stories.deleteStory);
await deleteStory({ id: storyId });
```

### 客户端状态

- **全局状态**: Zustand (未大量使用)
- **本地状态**: React useState, useMemo, useCallback

### 数据库 Schema (Convex)

主要表：

- `users`: 用户信息 + 积分
- `stories`: 视频项目内容、格式、AI 生成信息
- `storySegments`: 项目片段、图片状态
- `videos`: 视频元数据、状态
- `videoSegments`: 视频片段、语音状态
- `channels`: YouTube 频道

## 第三方服务集成

### OpenAI

- **文件**: `convex/chatgpt.ts`
- **用途**: 生成视频项目、优化内容
- **API**: Chat Completions API

### Replicate

- **文件**: `convex/replicate.ts`
- **用途**:
  - 生成图片（Stable Diffusion 等模型）
  - 生成视频（文本转视频模型）
- **配置**: 需要 REPLICATE_API_TOKEN

### Cloudinary

- **文件**: `convex/cloudinary.ts`
- **用途**: 存储生成的图片和视频
- **配置**: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### YouTube Data API

- **文件**: `convex/youtube.ts`
- **用途**: 上传视频、获取频道信息
- **认证**: OAuth2 (通过 Google Auth Library)

### AWS SQS

- **文件**: `convex/sqs.ts`
- **用途**: 异步任务队列（用于长时间运行的视频生成任务）
- **配置**: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SQS_QUEUE_URL

## 代码风格和规范

### 文件命名

- **组件**: kebab-case (`story-item.tsx`, `button.tsx`)
- **工具函数**: camelCase 或 kebab-case (`utils.ts`, `calculate-credits.ts`)
- **Convex 函数**: camelCase (`stories.ts`, `videos.ts`)

### 组件编写规范

```tsx
"use client"; // 客户端组件必须声明

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "~/convex/_generated/api";

// 使用 cva 变体
const Component = ({ className, ...props }) => {
  return <div className={cn("base-class", className)} {...props} />;
};
```

### 路径别名

- `@/*`: 映射到 `./src/*`
- `~/*`: 映射到 `./*` (Convex 生成类型)

## 开发工作流

### 启动开发环境

```bash
npm run dev          # 启动 Next.js (localhost:3000)
npx convex dev       # 启动 Convex 后端 (convex.cloud)
```

### 数据库操作

```bash
npm run db:generate  # 生成 Drizzle migration
npm run db:migrate   # 运行 migration
npm run db:studio    # 打开 Drizzle Studio
```

### 代码质量

```bash
npm run lint         # ESLint 检查
npm run build        # 构建生产版本（会进行类型检查）
```

### 环境变量

- **配置**: `src/env.js` (使用 Zod 验证)
- **示例**: `.env.example`
- **本地**: `.env.local` (已存在，包含实际密钥)
- **跳过验证**: `SKIP_ENV_VALIDATION=1 npm run build` (用于 Docker)

## 已知信息和注意事项

### 品牌信息

- **品牌名**: Wordream (不区分大小写，推荐使用 Wordream)
- **品牌颜色**: 紫色主题 (purple-300 到 purple-700)
- **字体**: Nosifer 用于品牌名和页面大标题

### 重要提醒

- Convex 函数在 `convex/` 目录下，修改后需要 `npx convex dev` 自动同步
- 图片和视频生成是异步过程，涉及多个步骤和状态管理
- YouTube 上传需要用户授权，使用 OAuth2 流程
- 自定义字体需要网络连接加载（Google Fonts）
- AWS SQS 用于异步任务，确保配置正确的队列 URL
- Hero 背景使用 WebGL Shader (`hero-canvas.tsx`)，基于 Bass Ripple 效果

### 关键文件速查

- **首页**: `src/app/(required-auth)/page.tsx`
- **项目列表**: `src/app/(required-auth)/stories/page.tsx`
- **脚本生成**: `src/app/(required-auth)/generate/script/page.tsx`
- **引导生成 (Guided)**: `src/app/(required-auth)/generate/guided/page.tsx`
- **片段生成**: `src/app/(required-auth)/generate/segment/page.tsx`
- **视频列表**: `src/app/(required-auth)/videos/page.tsx`
- **主布局**: `src/app/layout.tsx`
- **Header**: `src/components/header/header.tsx`
- **手机端菜单**: `src/components/header/menu-button.tsx`
- **Footer**: `src/components/shared/footer.tsx`
- **Hero**: `src/app/(required-auth)/_components/hero.tsx`
- **Hero Canvas**: `src/app/(required-auth)/_components/hero-canvas.tsx`
- **Convex Schema**: `convex/schema.ts`
- **环境配置**: `src/env.js`

### 待优化项

1. ❌ 测试框架未配置（无 Jest/Vitest）
2. ❌ 无 .cursorrules 或 Copilot 指令文件
3. ❌ 无 CI/CD 配置
4. ✅ 移动端适配已完成 (2026-05-12)
5. ❌ 图片和视频生成进度反馈

## 下一步建议

1. 配置 Vitest + Testing Library 进行测试
2. 创建 `.cursorrules` 或 `.github/copilot_instructions.md` 用于 AI 辅助编码
3. 完善错误处理和用户反馈机制
4. 添加日志记录和监控（Convex 提供日志功能）
5. ✅ 移动端体验优化已完成 (2026-05-12)
6. 添加生成进度实时反馈功能

## 2026-05-13 Guided 生成功能增强

### 新增功能

1. **时长选择**: 用户可选择目标视频时长 (15s/30s/1m/2m/3m)
2. **风格选择**: 15 种视觉风格预设
3. **剧本格式输出**: AI 输出专业剧本格式 (场景标题、动作描述、角色对话、镜头指示)

### 数据库变更

- `stories` 表新增 `styleId` 可选字段 (存储用户选择的视觉风格)
- `createStory` mutation 新增 `targetDuration` 和 `styleId` 参数

### 修改的文件

- `convex/schema.ts`: 新增 styleId 字段
- `convex/stories.ts`: createStory 支持新参数
- `convex/chatgpt.ts`: generateStory 使用新的剧本格式 prompt
- `src/app/(required-auth)/generate/guided/page.tsx`: 添加时长和风格选择 UI
