# Taro + Tailwind CSS + Redux Toolkit

A multi-platform development template based on Taro 4.x, Tailwind CSS 4.x, and Redux Toolkit, supporting WeChat Mini Program, H5, and other platforms.

## Tech Stack

### Core Framework

- **Taro 4.1.9** - Multi-platform unified development framework
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool

### Styling Solution

- **Tailwind CSS 4.x** - Utility-first CSS framework
- **@tailwindcss/postcss** - Tailwind CSS 4.x PostCSS plugin
- **weapp-tailwindcss** - Mini Program Tailwind CSS support

### State Management

- **Redux Toolkit** - Official Redux toolset
- **React Redux** - React bindings
- **Redux Logger** - Development logging middleware
- **Redux Thunk** - Async action support

### Icon Solution

- **Lucide** - Icon library
- **Icon Component** - Wrapped icon component with SVG to Base64 conversion

### Backend Service

- **PocketBase** - Lightweight backend service (runs via Docker)

### Code Quality

- **ESLint** - JavaScript/TypeScript code linting
- **Stylelint** - CSS code linting
- **Prettier** - Code formatting
- **Commitlint** - Git commit message conventions
- **Husky** - Git hooks management

## Features

- ✅ Multi-platform support (WeChat Mini Program, H5, Alipay Mini Program, Douyin Mini Program, etc.)
- ✅ Tailwind CSS 4.x integration with support for Tailwind utility classes in Mini Programs
- ✅ Redux Toolkit state management with type safety
- ✅ Full TypeScript support
- ✅ Icon component wrapper for unified icon usage
- ✅ PocketBase backend service integration
- ✅ Code quality tools (ESLint, Stylelint, Prettier)
- ✅ Git commit conventions (Commitlint, Husky)

## Quick Start

### Install Dependencies

```bash
bun install
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

### PocketBase Service

```bash
# Start PocketBase service
bun run dev:pb

# Stop service
bun run dev:pb:stop

# View logs
bun run dev:pb:logs

# Restart service
bun run dev:pb:restart
```

For more PocketBase usage instructions, see [pocketbase/README.md](./pocketbase/README.md)

## Project Structure

```
src/
  ├── app.tsx              # Application entry (includes Redux Provider)
  ├── app.config.ts        # Application config
  ├── app.css              # Global styles (imports Tailwind CSS)
  ├── components/          # Shared components
  │   └── Icon.tsx         # Icon component
  ├── pages/               # Pages directory
  │   └── index/
  │       ├── index.tsx
  │       └── index.config.ts
  ├── store/               # Redux Store
  │   ├── index.ts         # Store configuration
  │   ├── hooks.ts         # Type-safe hooks
  │   └── slices/          # Redux slices
  │       ├── appSlice.ts
  │       └── userSlice.ts
  └── types/               # Type definitions
      ├── store.ts         # Store types
      └── user.ts          # User types

config/                     # Build configuration
  ├── index.ts            # Main config
  ├── dev.ts              # Development config
  └── prod.ts             # Production config

pocketbase/                 # PocketBase backend service
  ├── docker-compose.yml  # Docker Compose configuration
  ├── Dockerfile          # Docker image build
  └── pb_migrations/      # Database migration files
```

## Usage Guide

### Using Tailwind CSS

Tailwind CSS is already imported in `src/app.css`. You can directly use Tailwind utility classes in components:

```tsx
<View className="flex items-center justify-center h-screen">
  <Text className="text-2xl font-bold">Hello Taro</Text>
</View>
```

### Using Redux Toolkit

#### In Components

```tsx
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setTheme } from '../../store/slices/appSlice'

export default function Index() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.app.theme)

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <View>
      <Text>Current theme: {theme}</Text>
      <Button onClick={toggleTheme}>Toggle Theme</Button>
    </View>
  )
}
```

For more Redux Toolkit usage instructions, see [doc/REDUX_TOOLKIT.md](./doc/REDUX_TOOLKIT.md)

### Using Icon Component

Use icons from the Lucide icon library:

```tsx
import { Icon } from '../../components/Icon'
import { Home } from 'lucide'

export default function Index() {
  return (
    <View>
      <Icon icon={Home} size={48} color="#333" />
    </View>
  )
}
```

**Note**: Prefer using the Icon component instead of images for icons.

### Code Standards

The project uses the following tools to ensure code quality:

- **ESLint** - Automatically checks for code issues
- **Stylelint** - Checks style code
- **Prettier** - Automatically formats code
- **Commitlint** - Enforces Git commit message conventions

Run code checks and formatting:

```bash
# Format code
bun run format

# Check code format
bun run format:check
```

## Notes

- The `weapp-tw patch` command will automatically run after the first dependency installation to handle Tailwind CSS compatibility in WeChat Mini Programs
- For development, it's recommended to open the `dist` directory in WeChat Developer Tools for preview
- Style units are automatically converted (rem to rpx)
- Avoid using `rpx` units unless necessary
- Avoid abusing `ScrollView` unless necessary
- Use Redux Toolkit for state management
- Use Icon component instead of images for icons
- Documentation files should be placed in the `doc` folder

## Development Guidelines

- Default language is English
- Use Tailwind CSS v4
- Run lint and tsc checks after every code change
- Use bun instead of npm
