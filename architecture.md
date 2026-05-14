# Architecture - Wordream

## 项目概述

**Wordream** 是一个基于 T3 Stack 的 AI 视频生成平台，帮助用户通过 AI 生成视频内容。用户可以描述一个想法或粘贴剧本，系统会自动构建场景、角色、镜头和配乐。

**项目路径**: `E:\Workspace\scary-video-generator-ai`  
**项目名称**: Wordream  
**创建时间**: 基于 create-t3-app (v7.37.0)  
**域名**: wordream.com (DNS 在 Cloudflare，邮件收发通过 Resend API + Cloudflare Email Routing)
**最后更新**: 2026-05-14 (Terms & Privacy 页面 + 品牌信息补充)

## 技术架构

### 核心技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.5 (严格模式)
- **后端**: Convex (实时后端 + NoSQL 数据库)
- **样式**: Tailwind CSS 3.4 + shadcn/ui + Radix UI
- **数据库**:
  - Convex (主数据库，NoSQL)
  - Drizzle ORM + MySQL (通过 Lucia Auth 使用)
- **认证**: Convex Auth + Lucia Auth (登录方式: Google OAuth, Password 邮箱密码, 密码重置)
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
  "gsap": "^3.12.5",
  "resend": "^4.0.0",
  "@react-email/components": "^0.0.25"
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
│   ├── terms/
│   │   └── page.tsx              # Terms of Service (不含 Link 到 Privacy)
│   ├── privacy/
│   │   └── page.tsx              # Privacy Policy (21 节，GDPR/CCPA/AU)
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
│       ├── settings/             # 用户设置
│       │   └── page.tsx          # 资料编辑（头像 + 姓名）
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
│   │   ├── select.tsx             # 下拉选择
│   │   ├── toast.tsx              # 提示消息
│   │   ├── file-upload.tsx        # 文件上传组件（支持拖拽/粘贴）
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
│   ├── talent/                   # 人才库相关组件
│   │   ├── add-talent-media-dialog.tsx
│   │   ├── add-talent-sheet-dialog.tsx
│   │   └── talent-media-upload.tsx
│   ├── auth/                     # 认证相关组件
│   │   ├── SignInWithPassword.tsx       # 邮箱密码登录/注册表单
│   │   ├── ResetPasswordWithEmailCode.tsx  # 密码重置流程（两步）
│   │   └── CodeInput.tsx               # 验证码输入框
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
├── auth.ts               # 认证逻辑（Password + Google providers）
├── otp/                  # 邮件验证码
│   ├── PasswordResetEmail.tsx      # 重置密码邮件模板 (React Email)
│   └── ResendOTPPasswordReset.ts   # Resend 发码服务端 provider
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
├── users.ts              # 用户管理（viewer 查询 + update 变更）
├── logs.ts               # 日志记录
├── storage.ts            # 存储配置（上传功能）
└── talent.ts             # 人才库功能
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
  <Link
    href="/terms"
    className="font-special text-sm text-purple-300 transition-colors hover:text-white"
  >
    Terms
  </Link>
  <Link
    href="/privacy"
    className="font-special text-sm text-purple-300 transition-colors hover:text-white"
  >
    Privacy
  </Link>
  <p className="font-special text-sm text-purple-400">&copy; 2026 Wordream</p>
</footer>
```

> 使用 `next/link` 的 `Link` 组件，悬停效果 `transition-colors hover:text-white`

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

- `users`: 用户信息 + 积分（name 字段: Google 用户自动获取，Password 用户从邮箱前缀派生）
- `stories`: 视频项目内容、格式、AI 生成信息
- `storySegments`: 项目片段、图片状态
- `videos`: 视频元数据、状态
- `videoSegments`: 视频片段、语音状态
- `channels`: YouTube 频道
- `talents`: 人才库（虚拟角色）
- `talentSheets`: 人才形象表
- `talentMedia`: 人才参考素材

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

- **配置**: `src/env.js` (使用 Zod 验证，仅限 Next.js 端)
- **Convex 环境变量**: `AUTH_RESEND_KEY`, `AUTH_EMAIL` 需通过 `npx convex env set` 设置到 Convex 后端
- **示例**: `.env.example`
- **本地**: `.env.local` (已存在，包含实际密钥；`npx convex dev` 会自动读取)
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
- **人才库列表**: `src/app/(required-auth)/talent/page.tsx`
- **人才详情**: `src/app/(required-auth)/talent/[talentId]/page.tsx`
- **团队列表**: `src/app/(required-auth)/teams/page.tsx`
- **团队详情**: `src/app/(required-auth)/teams/[teamId]/page.tsx`
- **用户设置**: `src/app/(required-auth)/settings/page.tsx`
- **Terms of Service**: `src/app/terms/page.tsx` (公开页面，无需登录)
- **Privacy Policy**: `src/app/privacy/page.tsx` (公开页面，无需登录)
- **主布局**: `src/app/layout.tsx`
- **Header**: `src/components/header/header.tsx`
- **手机端菜单**: `src/components/header/menu-button.tsx`
- **Footer**: `src/components/shared/footer.tsx`
- **Hero**: `src/app/(required-auth)/_components/hero.tsx`
- **Hero Canvas**: `src/app/(required-auth)/_components/hero-canvas.tsx`
- **Convex Auth**: `convex/auth.ts`
- **Password 重置后端**: `convex/otp/ResendOTPPasswordReset.ts`
- **Password 表单**: `src/components/auth/SignInWithPassword.tsx`
- **密码重置 UI**: `src/components/auth/ResetPasswordWithEmailCode.tsx`
- **Convex Schema**: `convex/schema.ts`
- **Convex Talent**: `convex/talent.ts`
- **Convex Storage**: `convex/storage.ts`
- **Convex Teams**: `convex/teams.ts`
- **Convex TeamMembers**: `convex/teamMembers.ts`
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

## 2026-05-13 人才库 (Talent Library) 功能

### 新增功能

管理 AI 视频中使用的虚拟角色/人才，支持图片和视频参考素材的上传与管理。

### 数据库 Schema

#### talents 表 (人才主表)

| 字段        | 类型                    | 说明                            |
| ----------- | ----------------------- | ------------------------------- |
| userId      | v.id("users")           | 所属用户                        |
| name        | v.string()              | 人才名称                        |
| description | v.optional(v.string())  | 描述                            |
| imageUrl    | v.optional(v.string())  | 头像 URL                        |
| isFavorite  | v.optional(v.boolean()) | 是否收藏                        |
| isHuman     | v.optional(v.boolean()) | 是否真人 (true=Human, false=AI) |
| isPublic    | v.optional(v.boolean()) | 是否公开                        |

#### talentSheets 表 (形象表)

| 字段          | 类型                     | 说明                                |
| ------------- | ------------------------ | ----------------------------------- |
| talentId      | v.id("talents")          | 关联的人才                          |
| name          | v.string()               | 形象名称                            |
| imageUrl      | v.optional(v.string())   | 形象图片 URL                        |
| imagePublicId | v.optional(v.string())   | 图片公开 ID                         |
| isDefault     | v.optional(v.boolean())  | 是否默认形象                        |
| source        | v.optional(v.union(...)) | 来源 (manual_upload / ai_generated) |

#### talentMedia 表 (参考素材表)

| 字段     | 类型                   | 说明                             |
| -------- | ---------------------- | -------------------------------- |
| talentId | v.id("talents")        | 关联的人才                       |
| type     | v.union(...)           | 类型 (image / video / recording) |
| url      | v.string()             | 素材 URL                         |
| publicId | v.optional(v.string()) | 公开 ID                          |

### Convex 后端

#### 新增文件

- `convex/talent.ts`: 人才库所有查询和变更
- `convex/storage.ts`: 新增 `generateUploadUrl`, `uploadTalentMedia`, `getStorageUrl`

#### API 列表

| 函数                 | 类型     | 说明                                   |
| -------------------- | -------- | -------------------------------------- |
| getTalents           | query    | 获取人才列表，支持 favoritesOnly 过滤  |
| getTalentById        | query    | 获取单个人才详情（含 sheets 和 media） |
| createTalent         | mutation | 创建人才                               |
| updateTalent         | mutation | 更新人才信息                           |
| deleteTalent         | mutation | 删除人才（级联删除 sheets 和 media）   |
| toggleTalentFavorite | mutation | 切换收藏状态                           |
| addTalentMedia       | mutation | 添加参考素材                           |
| deleteTalentMedia    | mutation | 删除参考素材                           |
| addTalentSheet       | mutation | 添加形象                               |
| setDefaultSheet      | mutation | 设置默认形象                           |
| deleteTalentSheet    | mutation | 删除形象                               |
| generateUploadUrl    | mutation | 获取上传 URL                           |
| uploadTalentMedia    | mutation | 上传素材并创建记录                     |
| getStorageUrl        | mutation | 获取存储 URL                           |

### 前端页面和组件

#### 页面

| 路径                 | 说明                                |
| -------------------- | ----------------------------------- |
| `/talent`            | 人才列表页，支持 All/Favorites 过滤 |
| `/talent/[talentId]` | 人才详情页，管理 media 和 sheets    |

#### 组件

| 组件                                                | 说明                              |
| --------------------------------------------------- | --------------------------------- |
| `src/components/talent/add-talent-media-dialog.tsx` | 添加参考素材对话框                |
| `src/components/talent/add-talent-sheet-dialog.tsx` | 添加形象对话框                    |
| `src/components/talent/talent-media-upload.tsx`     | 素材上传组件（支持多文件）        |
| `src/components/ui/file-upload.tsx`                 | 通用文件上传组件（支持拖拽/粘贴） |

### 导航集成

- Header: 添加 Talent 链接
- MenuButton: 添加 Talent 菜单项

### 配置更新

#### next.config.js 图片域名

新增 Convex 存储域名：

```js
{ protocol: "https", hostname: "*.convex.cloud" },
{ protocol: "https", hostname: "*.convex.site" },
```

### 使用说明

1. 用户可在 `/talent` 页面创建人才，标记为 Human 或 AI
2. 工具栏始终可见：左侧过滤按钮 `[All Talent] [Favorites]`，右侧 `[Add Talent]`
3. 每个 talent 可添加多个 Reference Media（图片/视频）作为参考
4. 每个 talent 可添加多个 Talent Sheet，用于 AI 生成时的形象参考
5. 支持设置默认形象、收藏、删除等操作

### 人才库 UI 优化 (2026-05-13)

#### 1. 列表页布局优化

**页面结构** (所有状态一致):

```
Talent Library (标题)
描述文字
[All Talent] [Favorites]          [Add Talent]  ← 工具栏始终显示
───────────────────────────────────────────────
Loading / 空状态 / 网格内容                     ← 仅这里变化
```

- **工具栏始终显示**: 过滤按钮 (`All Talent` / `Favorites`) 与 `Add Talent` 按钮放在同一行，过滤按钮在左，AddTalent 在右
- **描述文字始终显示**
- **Loading**: `talents === undefined` 时显示 "Loading talents..."
- **空状态** (区分两种场景):
  - `filter=all` + 无 talent → "You don't have any talent yet."
  - `filter=favorites` + 无收藏 → "No favorites yet."
  - 空状态不包含按钮（AddTalent 已固定在工具栏，切换筛选通过 "All Talent" 过滤按钮即可）

#### 2. 人才卡片展示优化

**图片优先级** (从上到下):

1. 第一张 Reference Media（按创建时间升序）
2. default Talent Sheet 的图片
3. talent 头像 (imageUrl)

**底部统计信息**:

- `X sheets` (purple-300 高亮) — Talent Sheets 数量
- `X images` — 参考图片数量
- `X videos` — 参考视频数量
- `No reference` — 三者均为空时显示

**视频展示**：

- 卡片上：如果第一张 media 是视频，渲染 `<video>`（首帧缩略图）+ 居中播放图标覆盖层
- 详情页：`VideoThumbnail` 组件，默认显示首帧 + 播放图标，悬停时图标淡出并静音播放，离开暂停
- 视频加载失败时显示纯播放图标 fallback

#### 3. 上传流程优化

**流程变更**:

- **之前**: 选择文件 → 立即自动上传
- **现在**: 选择文件 → 显示预览 → 点击 `Upload X files` 按钮 → 上传

**按钮进度反馈**:

- 单文件: `Upload 1 file` → `Uploading...`
- 多文件: `Upload 5 files` → `Uploading 2/5...`

**对话框关闭保护**:

- 上传中点击外部/按 Escape → 阻止关闭（`onInteractOutside` + `handleClose` 双重拦截）
- 上传完成 → 自动关闭对话框
- 已移除有歧义的 `Done` 按钮

#### 修改的文件

| 文件                                                 | 修改内容                                          |
| ---------------------------------------------------- | ------------------------------------------------- |
| `src/app/(required-auth)/talent/page.tsx`            | 工具栏布局、卡片展示优化、视频/图片区分渲染       |
| `src/app/(required-auth)/talent/[talentId]/page.tsx` | 新增 `VideoThumbnail` 组件（悬停播放 + 错误回退） |
| `src/components/talent/talent-media-upload.tsx`      | 确认后上传、进度显示、`onUploadingChange` 回调    |
| `src/components/talent/add-talent-media-dialog.tsx`  | 上传中关闭保护、移除 Done 按钮                    |

## 2026-05-14 认证增强: Password 登录 + 密码重置

### 新增功能

1. **Password (邮箱+密码) 登录/注册**: 用户在原有的 Google 登录之外，可选择邮箱+密码注册和登录
2. **密码重置 (Forgot Password)**: 通过邮箱验证码重置密码

### 认证配置

**后端** — `convex/auth.ts`:

- `Password` provider (`id: "password"`) — 处理邮箱+密码的登录/注册
- `reset: ResendOTPPasswordReset` — 密码重置通过 Resend 发送 8 位验证码
- `profile` 回调 — 注册时自动设置 `credits: 1000`（与 Google provider 一致）；同时从邮箱前缀自动派生 `name`（eg. `user@example.com` → `name: "user"`）
- `Google` provider — 保持原有 Google OAuth 登录不变

**邮件发送** — `convex/otp/ResendOTPPasswordReset.ts`:

- 使用 `@convex-dev/auth/providers/Email` 发送验证码
- 8 位纯数字验证码，通过 Resend API 发送
- 邮件模板为 `convex/otp/PasswordResetEmail.tsx` (React Email)

### 前端交互

**认证弹窗** — `src/components/header/header.tsx`:

- 点击 "Sign In" 打开 Dialog
- 两个视图切换: `signin`（默认）和 `reset`
- `signin` 视图: Google 按钮 + 分隔线 + Password 表单
- `reset` 视图: 两步重置流程

**Password 表单** — `src/components/auth/SignInWithPassword.tsx`:

- Sign In / Sign Up 切换（通过 hidden `flow` 字段）
- Sign In 时显示 "Forgot password?" 链接
- 提交时按钮显示 spinner 并禁用（`submitting` 状态）

**重置密码** — `src/components/auth/ResetPasswordWithEmailCode.tsx`:

- 步骤 1: 输入邮箱 → 调用 `signIn("password")` 带 `flow="reset"` → 发送验证码
- 步骤 2: 输入 8 位验证码 + 新密码 → 调用 `signIn("password")` 带 `flow="reset-verification"`

**验证码输入** — `src/components/auth/CodeInput.tsx`:

- 单行输入框，`inputMode="numeric"`，`autoComplete="one-time-code"`
- `name="code"` 与 Convex Auth 的字段名称匹配

### 边界情况处理

| 场景              | 处理方式                                                |
| ----------------- | ------------------------------------------------------- |
| Dialog 关闭       | 重置 `authView` 为 `"signin"`                           |
| 邮件发送失败      | Toast 提示 "Could not send reset code"                  |
| 验证码/密码错误   | Toast 提示 "Invalid code or password"（不透露具体错误） |
| 提交中关闭 Dialog | dialog 关闭时 authView 自动重置                         |
| 快速连续点击      | `submitting` 状态禁止重复提交                           |
| AuthLoader 干扰   | Dialog 打开时隐藏全局 auth loading spinner              |

### 环境变量

| 变量              | 说明           | 设置方式                             |
| ----------------- | -------------- | ------------------------------------ |
| `AUTH_RESEND_KEY` | Resend API Key | `npx convex env set` 或 `.env.local` |
| `AUTH_EMAIL`      | 发件人地址     | `npx convex env set` 或 `.env.local` |

### 修改的文件

| 文件                                                 | 说明                                     |
| ---------------------------------------------------- | ---------------------------------------- |
| `convex/auth.ts`                                     | 新增 Password provider + profile 回调    |
| `convex/otp/ResendOTPPasswordReset.ts`               | 新建: Resend 发码服务端                  |
| `convex/otp/PasswordResetEmail.tsx`                  | 新建: 重置码邮件模板                     |
| `src/components/auth/SignInWithPassword.tsx`         | 新建: 邮箱密码表单                       |
| `src/components/auth/ResetPasswordWithEmailCode.tsx` | 新建: 重置流程 UI                        |
| `src/components/auth/CodeInput.tsx`                  | 新建: 验证码输入                         |
| `src/components/header/header.tsx`                   | 重构: 从直接 Google 登录改为 Dialog 弹窗 |
| `.env.example`                                       | 添加 AUTH_RESEND_KEY, AUTH_EMAIL 注释    |

## 2026-05-14 团队管理 (Teams) 功能

### 新增功能

管理团队协作，支持团队成员共享视频项目（stories）。用户可以创建团队、邀请成员、管理权限。

### 数据库 Schema

#### teams 表 (团队主表)

| 字段        | 类型          | 说明       |
| ----------- | ------------- | ---------- |
| name        | v.string()    | 团队名称   |
| description | v.string()    | 团队描述   |
| ownerId     | v.id("users") | 团队所有者 |

索引: `by_ownerId`

#### teamMembers 表 (团队成员表)

| 字段   | 类型                                 | 说明     |
| ------ | ------------------------------------ | -------- |
| teamId | v.id("teams")                        | 关联团队 |
| userId | v.id("users")                        | 关联用户 |
| role   | v.union("admin", "editor", "viewer") | 成员角色 |

索引: `by_teamId`, `by_userId`, `by_teamId_and_userId`

#### stories 表变更

- 新增 `teamId: v.optional(v.id("teams"))` 字段
- 支持私有 stories (teamId = null) 和团队 stories (teamId 存在)
- 新增索引: `by_teamId`, `by_userId_and_teamId`

### Convex 后端

#### convex/teams.ts

| 函数   | 类型     | 说明                           |
| ------ | -------- | ------------------------------ |
| list   | query    | 获取用户所在的所有团队         |
| get    | query    | 获取单个团队详情               |
| create | mutation | 创建团队（创建者自动为 admin） |
| update | mutation | 更新团队信息（仅 admin）       |
| remove | mutation | 删除团队（仅 owner）           |

#### convex/teamMembers.ts

| 函数       | 类型     | 说明                               |
| ---------- | -------- | ---------------------------------- |
| listByTeam | query    | 获取团队成员列表                   |
| add        | mutation | 添加成员（通过 email，仅 admin）   |
| updateRole | mutation | 修改成员角色（仅 admin）           |
| remove     | mutation | 移除成员（支持自移除，有保护逻辑） |

#### convex/stories.ts 变更

- `get` query: 添加团队成员访问权限检查
- `getStories` query: 同时返回私有 stories 和团队 stories
- `getStoriesByTeam` query: 获取指定团队的所有 stories
- `createStory` mutation: 新增 `teamId` 参数
- `isStoryBelongToUser` internalQuery: 支持团队访问检查
- `deleteStory` mutation: 使用权限检查替代简单 userId 检查
- `edit` mutation: 使用扩展后的权限检查

### 前端页面

#### 页面路由

| 路径              | 说明              |
| ----------------- | ----------------- |
| `/teams`          | 团队列表页面      |
| `/teams/[teamId]` | 团队详情/成员管理 |

#### 新增/修改的文件

| 文件                                                | 修改内容                                        |
| --------------------------------------------------- | ----------------------------------------------- |
| `convex/schema.ts`                                  | 新增 teams, teamMembers 表，stories 添加 teamId |
| `convex/teams.ts`                                   | 团队 CRUD 操作                                  |
| `convex/teamMembers.ts`                             | 成员管理操作                                    |
| `src/components/header/header.tsx`                  | 添加 Teams 导航链接                             |
| `src/components/header/menu-button.tsx`             | 添加 Teams 菜单项                               |
| `src/app/(required-auth)/teams/page.tsx`            | 团队列表页面                                    |
| `src/app/(required-auth)/teams/[teamId]/page.tsx`   | 团队详情页面（含成员管理、编辑、删除）          |
| `src/app/(required-auth)/generate/script/page.tsx`  | 添加团队选择器                                  |
| `src/app/(required-auth)/generate/guided/page.tsx`  | 添加团队选择器                                  |
| `src/app/(required-auth)/generate/segment/page.tsx` | 添加团队选择器                                  |
| `src/app/(required-auth)/stories/page.tsx`          | 添加团队筛选、团队标签显示                      |

### 权限模型

#### 访问权限

| 类型         | 条件                        |
| ------------ | --------------------------- |
| 私有 stories | userId === currentUser      |
| 团队 stories | teamId 存在且用户是团队成员 |

#### 成员操作权限

| 操作             | Owner | Admin | Editor | Viewer |
| ---------------- | ----- | ----- | ------ | ------ |
| 创建团队         | ✓     | -     | -      | -      |
| 删除团队         | ✓     | -     | -      | -      |
| 编辑团队信息     | ✓     | ✓     | -      | -      |
| 添加成员         | ✓     | ✓     | -      | -      |
| 移除成员         | ✓     | ✓     | -      | -      |
| 修改成员角色     | ✓     | ✓     | -      | -      |
| 退出团队         | ✓     | ✓     | ✓      | ✓      |
| 创建团队 stories | ✓     | ✓     | ✓      | -      |
| 查看团队         | ✓     | ✓     | ✓      | ✓      |

#### Admin 保护逻辑

- **防止移除 owner**: team.ownerId === targetUser.userId 时禁止移除
- **防止移除最后一个 admin**: adminCount <= 1 时禁止移除
- **防止 admin 移除其他 admin**: 仅 owner 可以移除 admin
- **自移除保护**: 自移除时若为最后一个 admin 则禁止

### 使用说明

1. 用户可在 `/teams` 页面创建团队
2. 创建者自动成为团队 admin 和 owner
3. admin 可通过 email 添加团队成员
4. 成员可选择角色：admin / editor / viewer
5. 在生成页面可选择团队，创建团队共享的 stories
6. stories 列表页可按团队筛选
7. 团队成员均可查看/编辑/删除团队 stories（权限通过 isStoryBelongToUser 检查）

### 团队管理增强 (2026-05-14)

#### 新增功能

1. **故事详情页团队修改**

   - 路径: `/stories/[storyId]`
   - 功能: 在故事详情页右上角可以修改故事的团队归属
   - 支持: 私有 ↔ 团队之间切换

2. **删除团队时自动清理**

   - 删除团队时，自动将关联的 stories 设为私有
   - 防止 stories 的 teamId 指向不存在的团队

3. **Stories 列表页样式优化**
   - 布局改为工具栏样式（与 Talent 页面一致）
   - Private 选项使用 Lock 图标，团队使用 UsersIcon 图标
   - 统一间距与 Talent 页面一致

#### 修改的文件

| 文件                                                 | 修改内容                       |
| ---------------------------------------------------- | ------------------------------ |
| `convex/stories.ts`                                  | edit mutation 新增 teamId 参数 |
| `convex/teams.ts`                                    | remove 新增清理 stories 的逻辑 |
| `src/app/(required-auth)/stories/[storyId]/page.tsx` | 添加团队选择器                 |
| `src/app/(required-auth)/stories/page.tsx`           | 布局优化 + Lock 图标           |

#### 边界情况处理

| 场景             | 处理方式                       |
| ---------------- | ------------------------------ |
| 快速连续切换团队 | isChangingTeam 状态禁用选择器  |
| 切换失败         | toast 错误提示                 |
| teams 加载中     | 不显示选择器（防止显示空下拉） |
| 用户无团队       | 详情页不显示团队选择器         |
| 删除团队         | 关联的 stories 自动转为私有    |

## 2026-05-14 用户资料管理 (User Settings)

### 新增功能

1. **用户设置页面 (`/settings`)**: 用户可编辑头像和显示名称
2. **自动命名**: Password（邮箱）注册用户自动从邮箱前缀派生 `name`，不再显示空名
3. **导航入口**: 桌面端用户下拉菜单 + 手机端菜单均添加 "Settings" 链接

### 后端变更

**`convex/auth.ts`** — Password provider profile 回调:

- 新增从邮箱前缀自动派生 `name`（eg. `user@example.com` → `"user"`）
- 增加 `params.email` 为 `undefined` 时的安全兜底（`?? ""`）

**`convex/users.ts`** — 新增 `update` mutation:

| 参数  | 类型                     | 说明                    |
| ----- | ------------------------ | ----------------------- |
| name  | `v.optional(v.string())` | 用户显示名称            |
| image | `v.optional(v.string())` | 头像 URL（Convex 存储） |

- 仅 patch 传入的字段，未传字段保持不变
- 未认证时抛 `ConvexError("Unauthenticated")`

### 前端页面

#### `/settings` 页面 (`src/app/(required-auth)/settings/page.tsx`)

**Profile Picture 卡片:**

- 大尺寸 Avatar（`h-24 w-24`）展示当前头像
- 右下角相机按钮触发文件选择
- 上传流程: `generateUploadUrl → POST → getStorageUrl → updateUser`
- 上传中按钮禁用并显示 spinner
- 非图片文件 toast 提示拒绝
- Blob URL 通过 ref 追踪，新选择时释放旧 URL，组件卸载时 cleanup

**Display Name 卡片:**

- Name input: `value={name}` 直接绑定 state，`placeholder` 显示当前服务端值
- 用户删除文字时不会跳回原名（区别于上一版使用 `currentName` 回退的逻辑）
- Email input: 只读显示，提示不可更改
- Save 按钮: `disabled` 条件为 `isSaving || !(name.trim() && name.trim() !== user?.name)`，空值或未变更时禁用

### 导航集成

| 位置                           | 改动                                               |
| ------------------------------ | -------------------------------------------------- |
| `header.tsx` — ProfileDropdown | 用户名与 Sign out 之间新增 `Link href="/settings"` |
| `menu-button.tsx`              | Teams 菜单项之后新增 `Link href="/settings"`       |

### 修改的文件

| 文件                                        | 修改内容                              |
| ------------------------------------------- | ------------------------------------- |
| `convex/auth.ts`                            | Password profile 派生 name，安全兜底  |
| `convex/users.ts`                           | 新增 update mutation                  |
| `src/app/(required-auth)/settings/page.tsx` | 新建: 用户设置页面（头像 + 姓名编辑） |
| `src/components/header/header.tsx`          | 新增 Settings 下拉菜单项              |
| `src/components/header/menu-button.tsx`     | 新增 Settings 手机端菜单项            |

## 2026-05-14 Terms & Privacy 页面

### 新增功能

1. **Terms of Service 页面 (`/terms`)**: 17 节，涵盖积分退款政策、AI 透明声明、澳大利亚消费者法、争议解决
2. **Privacy Policy 页面 (`/privacy`)**: 21 节，覆盖 GDPR / CCPA / AU Privacy Act，含 AI 处理披露、数据跨境传输、Cookie 声明
3. **Footer 链接**: Terms 和 Privacy 从纯文本改为 `next/link` 的 `Link` 组件，hover 效果白色

### 品牌信息更新

| 项目     | 值                          |
| -------- | --------------------------- |
| 域名     | wordream.com                |
| DNS      | Cloudflare                  |
| 邮件发送 | Resend API                  |
| 邮件接收 | Cloudflare Email Routing    |
| 邮箱     | support@wordream.com (通用) |
|          | privacy@wordream.com (隐私) |

### 样式规范（Legal 页面）

- 页面大标题: `font-nosifer text-2xl md:text-[50px] text-purple-300`
- 正文: `font-special leading-relaxed text-gray-300`
- 小节标题: `font-special text-2xl font-bold text-purple-300`
- 提示框: `rounded-lg border border-purple-700 bg-muted/50 p-4`
- 链接: `underline underline-offset-4 text-purple-300 hover:text-white`
- 列表: `list-disc space-y-2 pl-6`
- 页面容器: `mx-auto max-w-3xl px-6 py-24 md:py-32`

> 两个页面均放在 `src/app/`（`(required-auth)` 外部），无需登录即可访问。

### 修改的文件

| 文件                               | 修改内容                            |
| ---------------------------------- | ----------------------------------- |
| `src/app/terms/page.tsx`           | 新建: Terms of Service 页面         |
| `src/app/privacy/page.tsx`         | 新建: Privacy Policy 页面           |
| `src/components/shared/footer.tsx` | Terms/Privacy 改为 Link 组件        |
| `architecture.md`                  | 更新项目结构、品牌信息、Footer 链接 |
