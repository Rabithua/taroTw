# Taro + Tailwind CSS Template

A multi-platform development template based on Taro 4.x and Tailwind CSS, supporting Tailwind CSS for styling.

## Tech Stack

- Taro 4.1.9
- React 18
- TypeScript
- Tailwind CSS 4.x
- Vite
- weapp-tailwindcss

## Features

- Multi-platform support (WeChat Mini Program, H5, Alipay Mini Program, Douyin Mini Program, etc.)
- Integrated Tailwind CSS with support for Tailwind utility classes in WeChat Mini Programs
- TypeScript support
- Code quality tools (ESLint, Stylelint)
- Git commit conventions (Commitlint, Husky)

## Quick Start

### Install Dependencies

```bash
bun install
# or
npm install
```

### Development

```bash
# WeChat Mini Program
bun run dev:weapp

# H5
bun run dev:h5

# Other platforms
bun run dev:swan      # Baidu Mini Program
bun run dev:alipay    # Alipay Mini Program
bun run dev:tt        # Douyin Mini Program
bun run dev:qq        # QQ Mini Program
bun run dev:jd        # JD Mini Program
```

### Build

```bash
# WeChat Mini Program
bun run build:weapp

# H5
bun run build:h5

# Other platforms follow the same pattern
```

## Project Structure

```
src/
  ├── app.ts              # Application entry
  ├── app.config.ts       # Application config
  ├── app.css             # Global styles (imports Tailwind CSS)
  └── pages/              # Pages directory
      └── index/
          ├── index.tsx
          ├── index.config.ts
          └── index.css

config/                   # Build configuration
  ├── index.ts           # Main config
  ├── dev.ts             # Development config
  └── prod.ts            # Production config
```

## Using Tailwind CSS

Tailwind CSS is already imported in `src/app.css`. You can directly use Tailwind utility classes in components:

```tsx
<View className="flex items-center justify-center h-screen">
  <Text className="text-2xl font-bold">Hello Taro</Text>
</View>
```

## Notes

- The `weapp-tw patch` command will automatically run after the first dependency installation to handle Tailwind CSS compatibility in WeChat Mini Programs
- For development, it's recommended to open the `dist` directory in WeChat Developer Tools for preview
- Style units are automatically converted (rem to rpx)
