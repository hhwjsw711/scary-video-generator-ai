# AGENTS.md - Scary Video Generator AI

## Project Overview

This is a T3 Stack application for generating scary videos using AI. It combines Next.js 14, TypeScript, Convex, Tailwind CSS, and various AI services (OpenAI, Replicate).

## Build & Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npx convex dev       # Start Convex backend in dev mode

# Build & Production
npm run build        # Build for production (next build)
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint (next lint)

# Database (Drizzle ORM)
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes (no migrations)
npm run db:studio    # Open Drizzle Studio

# Environment Validation
# Run with SKIP_ENV_VALIDATION=1 to skip env validation during build
```

## Testing

No testing framework is currently configured. If adding tests:

- Jest or Vitest are recommended for this TypeScript/Next.js project
- Place test files as `*.test.ts(x)` or `*.spec.ts(x)` near the code they test
- Example for running a single test (once configured):
  ```bash
  npm test -- --testPathPattern=button.test.tsx
  # or with vitest
  npx vitest run src/components/ui/button.test.tsx
  ```

## Code Style Guidelines

### TypeScript & Imports

- Use TypeScript strict mode (enabled in tsconfig.json)
- Use `type` imports for type-only imports when possible
- Path aliases:
  - `@/*` maps to `./src/*`
  - `~/*` maps to `./*` (used for Convex generated types)
- Import order: React/system imports first, then third-party, then local (@/ or ~/)

```ts
import { type ClassValue } from "clsx"; // type import
import { cn } from "@/lib/utils";
import { api } from "~/convex/_generated/api";
```

### File Naming

- **Components**: kebab-case (e.g., `story-item.tsx`, `button.tsx`)
- **Utilities**: camelCase or kebab-case (e.g., `utils.ts`, `calculate-credits.ts`)
- **Convex functions**: camelCase (e.g., `stories.ts`, `videos.ts`)

### Component Conventions

- Use `"use client"` directive at top of file for client components
- Prefer named exports for components
- Use `React.forwardRef` for reusable components that need ref forwarding
- Set `displayName` for components created with `forwardRef`

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    // ...
  },
);
Button.displayName = "Button";
```

### Styling

- Use Tailwind CSS for styling (v3.4 with animations plugin)
- Use `cn()` utility from `@/lib/utils` to merge class names
- Tailwind class ordering is handled by `prettier-plugin-tailwindcss`
- Use shadcn/ui components from `src/components/ui/` when possible
- Custom fonts: Amatic, Special, Jolly, Nosifer (defined in tailwind.config.ts)

```tsx
<div className={cn("flex items-center", className)}>
```

### Convex Functions

- Place Convex functions in `convex/` directory
- Use `query`, `mutation`, `action` from `./_generated/server`
- Define argument validators with `v` from `convex/values`
- Export functions as named exports

```ts
export const getStories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stories").collect();
  },
});
```

### Error Handling

- Use try-catch blocks for async operations
- Log errors appropriately (consider using Convex logs)
- Return error states in UI components
- Use Zod for runtime validation (env variables use `@t3-oss/env-nextjs`)

### State Management

- Use Convex `useQuery` and `useMutation` for server state
- Use Zustand for client-side global state
- Use React hooks (`useState`, `useMemo`, `useCallback`) for local state

### Naming Conventions

- **Components**: PascalCase (`StoryItem`, `VideoPlayer`)
- **Functions**: camelCase (`handleDelete`, `splitStory`)
- **Constants**: camelCase or UPPER_SNAKE_CASE for true constants
- **Types/Interfaces**: PascalCase (`ButtonProps`, `Doc<"stories">`)

### Environment Variables

- Server-side: Define in `src/env.js` with Zod validation
- Client-side: Prefix with `NEXT_PUBLIC_`
- Use `SKIP_ENV_VALIDATION=1` to skip validation during Docker builds

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5
- **Backend**: Convex (realtime backend)
- **Database**: Convex (NoSQL) + Drizzle ORM (MySQL via Lucia Auth)
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Convex Auth + Lucia Auth
- **AI Services**: OpenAI, Replicate, Cloudinary
- **Validation**: Zod
- **Icons**: Lucide React, Radix Icons
