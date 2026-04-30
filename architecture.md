# Architecture - Scary Video Generator AI

## 项目概述

这是一个基于 T3 Stack 的 AI 恐怖视频生成器应用，帮助用户通过 AI 生成恐怖故事、配音和视频内容，并支持上传到 YouTube。

**项目路径**: `E:\Workspace\scary-video-generator-ai`  
**创建时间**: 基于 create-t3-app (v7.37.0)  
**最后更新**: 2026-04-30

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
  "lucide-react": "^0.429.0"
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
└── src/env.js            # 环境变量验证（Zod）
```

### 源代码结构 (`src/`)

```
src/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（全局 providers）
│   ├── page.tsx                  # 首页
│   ├── error.tsx                 # 错误处理页
│   ├── not-found.tsx             # 404 页面
│   ├── maintenance.tsx           # 维护页面
│   └── (required-auth)/          # 需要认证的路由组
│       ├── page.tsx              # 仪表盘首页
│       ├── stories/              # 故事管理
│       │   ├── page.tsx          # 故事列表
│       │   └── [storyId]/        # 故事详情
│       │       ├── page.tsx      # 故事查看/编辑
│       │       └── refine/       # 故事优化页面
│       ├── videos/               # 视频管理
│       │   └── page.tsx          # 视频列表
│       └── generate/             # 生成功能
│           ├── page.tsx          # 生成入口
│           ├── script/           # 脚本生成
│           ├── segment/          # 片段生成
│           └── guided/           # 引导式生成
├── components/                   # React 组件
│   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── button.tsx            # 按钮（使用 forwardRef + cva）
│   │   ├── card.tsx              # 卡片
│   │   ├── dialog.tsx            # 对话框
│   │   ├── input.tsx             # 输入框
│   │   ├── select.tsx            # 下拉选择
│   │   ├── toast.tsx             # 提示消息
│   │   └── ...                  # 其他 20+ 组件
│   ├── stories/                  # 故事相关组件
│   │   ├── story-item.tsx        # 故事项展示
│   │   ├── story-menus.tsx       # 故事操作菜单
│   │   ├── segment-item.tsx      # 故事片段项
│   │   ├── refine-form.tsx       # 优化表单
│   │   └── image-prompt-form.tsx # 图片提示词表单
│   ├── videos/                   # 视频相关组件
│   │   ├── video-item.tsx        # 视频项
│   │   ├── upload-youtube-form.tsx
│   │   └── connect-youtube-button.tsx
│   ├── shared/                   # 共享组件
│   │   ├── loader.tsx            # 加载器
│   │   ├── footer.tsx            # 页脚
│   │   └── custom-modal.tsx      # 自定义模态框
│   ├── header/                   # 头部组件
│   │   ├── header.tsx
│   │   ├── menu-button.tsx
│   │   └── mode-toggle.tsx       # 主题切换
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
│   └── magic-link.tsx
├── styles/                       # 全局样式
│   ├── globals.css               # Tailwind 基础样式
│   ├── fonts.ts                  # 自定义字体加载
│   ├── icons.tsx                 # 图标
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
├── stories.ts            # 故事相关查询/变更 (17,543 字节)
├── videos.ts             # 视频相关查询/变更 (8,847 字节)
├── storySegments.ts      # 故事片段处理 (10,631 字节)
├── videoSegments.ts      # 视频片段处理 (5,939 字节)
├── chatgpt.ts            # OpenAI 集成 (14,952 字节)
├── replicate.ts          # Replicate API 集成 (2,486 字节)
├── cloudinary.ts         # Cloudinary 云存储 (1,276 字节)
├── youtube.ts            # YouTube API 集成 (6,174 字节)
├── images.ts             # 图片处理 (6,207 字节)
├── voices.ts             # 语音合成 (2,254 字节)
├── credits.ts            # 积分系统 (620 字节)
├── channels.ts           # YouTube 频道 (1,719 字节)
├── sqs.ts                # AWS SQS 消息队列 (6,688 字节)
├── http.ts               # HTTP 端点 (2,460 字节)
├── users.ts              # 用户管理 (293 字节)
├── logs.ts               # 日志记录 (447 字节)
└── storage.ts            # 存储配置 (191 字节)
```

## 核心功能模块

### 1. 故事生成流程

```
用户输入 → OpenAI 生成故事 → 存储到 Convex → 展示在 /stories
```

- **入口**: `/generate/script` 或 `/generate/guided`
- **核心文件**: `convex/stories.ts`, `convex/chatgpt.ts`
- **组件**: `src/components/stories/`

### 2. 故事优化 (Refine)

- **路径**: `/stories/[storyId]/refine`
- **功能**: 修改故事、生成图片提示词、调整格式（16:9 或 9:16）
- **核心**: `convex/storySegments.ts`

### 3. 视频生成

- **流程**: 故事 → 生成语音 → 生成图片 → 合成视频 → 上传 YouTube
- **服务**:
  - 语音: `convex/voices.ts`
  - 图片: `convex/images.ts` (使用 Replicate)
  - 视频: `convex/videos.ts` (使用 Replicate)
  - 上传: `convex/youtube.ts`

### 4. YouTube 集成

- **功能**: 连接 YouTube 账号、上传视频、管理频道
- **组件**: `src/components/videos/connect-youtube-button.tsx`
- **后端**: `convex/youtube.ts`, `convex/channels.ts`

### 5. 积分系统

- **文件**: `convex/credits.ts`, `src/lib/calculate-credits.ts`
- **用途**: 控制用户使用 AI 生成功能的次数

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

- **全局状态**: Zustand (未在代码中找到具体 store，可能未大量使用)
- **本地状态**: React useState, useMemo, useCallback

### 数据库 Schema (Convex)

主要表（从 schema.ts 推断）：

- `stories`: 故事内容、格式、AI 生成信息
- `videos`: 视频元数据、状态
- `storySegments`: 故事片段、图片状态
- `videoSegments`: 视频片段、语音状态
- `users`: 用户信息
- `channels`: YouTube 频道
- `credits`: 用户积分

## 第三方服务集成

### OpenAI

- **文件**: `convex/chatgpt.ts`
- **用途**: 生成恐怖故事、优化故事内容
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
- **用途**: 异步任务队列（可能用于长时间运行的视频生成任务）
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

// 使用 forwardRef 和 displayName
const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    // ...
  },
);
Component.displayName = "Component";
```

### 样式规范

- 使用 Tailwind CSS 实用类
- 使用 `cn()` 函数合并类名：`cn("base-class", className, condition && "conditional-class")`
- 自定义字体：Amatic, Special, Jolly, Nosifer（恐怖主题）
- 主题色：紫色调（purple-300, purple-500, purple-700）

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

### 已完成的工作

1. ✅ 基础 T3 Stack 项目搭建
2. ✅ Convex 后端集成（多个功能模块）
3. ✅ AI 服务集成（OpenAI, Replicate, Cloudinary）
4. ✅ YouTube API 集成
5. ✅ shadcn/ui 组件库配置
6. ✅ 认证系统（Convex Auth + Lucia Auth）
7. ✅ 故事生成和优化功能
8. ✅ 视频生成流程
9. ✅ AGENTS.md 创建（代码规范文档）

### 缺失的功能/待办

1. ❌ 测试框架未配置（无 Jest/Vitest）
2. ❌ 无 .cursorrules 或 Copilot 指令文件
3. ❌ 无 CI/CD 配置
4. ❌ 错误处理可能需要完善
5. ❌ 移动端适配（部分页面可能未优化）

### 重要提醒

- Convex 函数在 `convex/` 目录下，修改后需要 `npx convex dev` 自动同步
- 图片和视频生成是异步过程，涉及多个步骤和状态管理
- YouTube 上传需要用户授权，使用 OAuth2 流程
- 自定义字体需要网络连接加载（Google Fonts）
- AWS SQS 用于异步任务，确保配置正确的队列 URL

### 关键文件速查

- **入口页面**: `src/app/(required-auth)/page.tsx`
- **故事列表**: `src/app/(required-auth)/stories/page.tsx`
- **故事生成**: `src/app/(required-auth)/generate/script/page.tsx`
- **视频列表**: `src/app/(required-auth)/videos/page.tsx`
- **主布局**: `src/app/layout.tsx`
- **Convex Schema**: `convex/schema.ts`
- **环境配置**: `src/env.js`

## 下一步建议

1. 如果需要添加测试，配置 Vitest + Testing Library
2. 如果需要 AI 辅助编码，创建 `.cursorrules` 或 `.github/copilot-instructions.md`
3. 完善错误处理和用户反馈机制
4. 添加日志记录和监控（Convex 提供日志功能）
5. 优化移动端体验
