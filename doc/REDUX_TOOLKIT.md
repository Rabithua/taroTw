# Redux Toolkit 配置指南

本文档详细说明本项目如何配置和使用 Redux Toolkit，为其他项目提供参考。

## 目录

- [依赖安装](#依赖安装)
- [项目结构](#项目结构)
- [Store 配置](#store-配置)
- [类型定义](#类型定义)
- [创建 Slice](#创建-slice)
- [在应用中使用](#在应用中使用)
- [在组件中使用](#在组件中使用)
- [异步操作](#异步操作)
- [最佳实践](#最佳实践)

## 依赖安装

### 核心依赖

```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.11.2",
    "react-redux": "^9.2.0",
    "redux": "^5.0.1",
    "redux-logger": "^3.0.6",
    "redux-thunk": "^3.1.0"
  },
  "devDependencies": {
    "@types/redux-logger": "^3.0.13"
  }
}
```

### 安装命令

```bash
bun add @reduxjs/toolkit react-redux redux redux-logger redux-thunk
bun add -d @types/redux-logger
```

## 项目结构

```
src/
  ├── store/
  │   ├── index.ts              # Store 配置
  │   ├── hooks.ts              # 类型安全的 hooks
  │   └── slices/               # Redux slices
  │       ├── userSlice.ts
  │       ├── appSlice.ts
  │       └── groupSlice.ts
  │
  └── types/
      └── store.ts              # Store 类型定义
```

## Store 配置

### 基础配置 (`src/store/index.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import userReducer from './slices/userSlice'
import appReducer from './slices/appSlice'
import groupReducer from './slices/groupSlice'

export default function configStore() {
  const store = configureStore({
    reducer: {
      user: userReducer,
      app: appReducer,
      group: groupReducer,
    },
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware({
        // 禁用 thunk 的 extraArgument，避免使用 AbortController
        thunk: {
          extraArgument: undefined,
        },
      })
      // 开发环境添加 redux-logger
      if (process.env.NODE_ENV === 'development') {
        middlewares.push(createLogger())
      }
      return middlewares
    },
    devTools: process.env.NODE_ENV === 'development',
  })
  return store
}
```

### 配置说明

1. **Reducer 配置**：将所有 slice 的 reducer 合并到 store 中
2. **中间件配置**：
   - 使用 `getDefaultMiddleware` 获取默认中间件（包含 redux-thunk）
   - 开发环境添加 `redux-logger` 用于调试
   - 禁用 thunk 的 `extraArgument`（避免 AbortController 相关问题）
3. **DevTools**：开发环境启用 Redux DevTools

## 类型定义

### Store 类型 (`src/types/store.ts`)

```typescript
import { Action } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import configStore from '../store'

// Store 类型定义
export type AppStore = ReturnType<typeof configStore>

// RootState 类型定义
export type RootState = ReturnType<AppStore['getState']>

// AppDispatch 类型定义 - 支持 thunk actions
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>

// Thunk Action 类型定义
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
```

### 类型安全的 Hooks (`src/store/hooks.ts`)

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../types/store'

// 类型安全的 useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>()

// 类型安全的 useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

**重要**：始终使用 `useAppDispatch` 和 `useAppSelector` 而不是原生的 `useDispatch` 和 `useSelector`，以获得完整的类型支持。

## 创建 Slice

### 同步 Slice 示例 (`src/store/slices/userSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '../../types/user'

interface UserState {
  userInfo: UserInfo | null
  isLogin: boolean
  token: string
}

const initialState: UserState = {
  userInfo: null,
  isLogin: false,
  token: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
      state.userInfo = action.payload
      state.isLogin = !!action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isLogin = !!action.payload
    },
    clearUser: (state) => {
      state.userInfo = null
      state.token = ''
      state.isLogin = false
    },
  },
})

export const { setUserInfo, setToken, clearUser } = userSlice.actions
export default userSlice.reducer
```

### 异步 Slice 示例 (`src/store/slices/groupSlice.ts`)

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { groupApi } from '../../services/api'

interface GroupState {
  recommendData: Dynamic[]
  recommendLoading: boolean
  recommendError: string | null
  recommendPage: number
  recommendIsEnding: boolean
}

const initialState: GroupState = {
  recommendData: [],
  recommendLoading: false,
  recommendError: null,
  recommendPage: 1,
  recommendIsEnding: false,
}

// 创建异步 thunk
export const fetchRecommendList = createAsyncThunk(
  'group/fetchRecommendList',
  async (params: { page?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      const page = params.page || 1
      const pageSize = params.pageSize || 20
      const data = await groupApi.getRecommendList({ page, pageSize })
      return {
        data,
        page,
        pageSize,
        isEnding: !data || data.length < pageSize,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取推荐列表失败'
      return rejectWithValue(errorMessage)
    }
  }
)

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    // 同步 reducers
    setActiveTabIndex: (state, action: PayloadAction<number>) => {
      state.activeTabIndex = action.payload
    },
    clearRecommendData: (state) => {
      state.recommendData = []
      state.recommendPage = 1
      state.recommendIsEnding = false
    },
  },
  extraReducers: (builder) => {
    // 处理异步 thunk 的三种状态
    builder
      .addCase(fetchRecommendList.pending, (state) => {
        state.recommendLoading = true
        state.recommendError = null
      })
      .addCase(fetchRecommendList.fulfilled, (state, action) => {
        state.recommendLoading = false
        state.recommendData = action.payload.data
        state.recommendPage = action.payload.page
        state.recommendIsEnding = action.payload.isEnding
      })
      .addCase(fetchRecommendList.rejected, (state, action) => {
        state.recommendLoading = false
        state.recommendError = action.payload as string
      })
  },
})

export const { setActiveTabIndex, clearRecommendData } = groupSlice.actions
export default groupSlice.reducer
```

### Slice 创建要点

1. **使用 `createSlice`**：简化 reducer 和 action 的创建
2. **使用 `PayloadAction<T>`**：为 action payload 提供类型
3. **直接修改 state**：Redux Toolkit 使用 Immer，可以直接修改 state
4. **异步操作使用 `createAsyncThunk`**：处理异步逻辑
5. **使用 `extraReducers`**：处理异步 thunk 的 pending/fulfilled/rejected 状态

## 在应用中使用

### 配置 Provider (`src/app.tsx`)

```typescript
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import configStore from "./store";

const store = configStore();

// 内部组件：在 Provider 内部使用 Redux hooks
function AppInner({ children }: PropsWithChildren<unknown>) {
  const dispatch = useAppDispatch();

  useLaunch(() => {
    // 在应用启动时初始化数据
    const systemInfo = Taro.getSystemInfoSync();
    dispatch(setSystemInfo(systemInfo));
  });

  return <>{children}</>;
}

function App({ children }: PropsWithChildren<unknown>) {
  return (
    <Provider store={store}>
      <AppInner>{children}</AppInner>
    </Provider>
  );
}

export default App;
```

**注意**：Redux hooks 只能在 `Provider` 内部使用，因此需要创建一个内部组件来使用 hooks。

## 在组件中使用

### 基础用法

```typescript
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUserInfo } from "../../store/slices/userSlice";

const MyComponent: React.FC = () => {
  const dispatch = useAppDispatch();

  // 获取状态
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const isLogin = useAppSelector((state) => state.user.isLogin);

  // 派发同步 action
  const handleLogin = () => {
    dispatch(setUserInfo({ id: "1", name: "User" }));
  };

  return <View>{isLogin ? <Text>已登录</Text> : <Text>未登录</Text>}</View>;
};
```

### 使用异步 Thunk

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchRecommendList,
  loadMoreRecommendList,
} from "../../store/slices/groupSlice";

const GroupPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // 从 Redux store 获取状态
  const { recommendData, recommendLoading, recommendError, recommendIsEnding } =
    useAppSelector((state) => state.group);

  useEffect(() => {
    // 初始加载
    dispatch(fetchRecommendList({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  // 加载更多
  const handleLoadMore = () => {
    if (!recommendLoading && !recommendIsEnding) {
      dispatch(loadMoreRecommendList());
    }
  };

  return (
    <View>
      {recommendLoading && <Text>加载中...</Text>}
      {recommendError && <Text>错误: {recommendError}</Text>}
      {recommendData.map((item) => (
        <DynamicCard key={item.id} data={item} />
      ))}
    </View>
  );
};
```

## 异步操作

### createAsyncThunk 使用指南

#### 基础用法

```typescript
export const fetchData = createAsyncThunk(
  'module/fetchData',
  async (params: { id: string }, { rejectWithValue }) => {
    try {
      const data = await api.getData(params.id)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取数据失败'
      return rejectWithValue(errorMessage)
    }
  }
)
```

#### 访问 state

```typescript
export const loadMoreData = createAsyncThunk(
  'module/loadMoreData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { module: ModuleState }
      const { page, pageSize } = state.module
      const nextPage = page + 1
      const data = await api.getData({ page: nextPage, pageSize })
      return { data, page: nextPage }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载失败'
      return rejectWithValue(errorMessage)
    }
  }
)
```

#### 处理异步状态

```typescript
extraReducers: (builder) => {
  builder
    .addCase(fetchData.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchData.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    .addCase(fetchData.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
}
```

## 最佳实践

### 1. 类型安全

- ✅ 始终使用 `useAppDispatch` 和 `useAppSelector`
- ✅ 为所有 state 和 action payload 定义类型
- ✅ 使用 `PayloadAction<T>` 为 action 提供类型

### 2. 代码组织

- ✅ 按功能模块组织 slices
- ✅ 每个 slice 包含相关的 state、actions 和 thunks
- ✅ 将类型定义放在 `types/` 目录

### 3. 状态管理

- ✅ 保持 state 扁平化，避免深层嵌套
- ✅ 使用 Immer 直接修改 state（Redux Toolkit 已内置）
- ✅ 为异步操作提供 loading 和 error 状态

### 4. 性能优化

- ✅ 使用 `useAppSelector` 时使用选择器函数，避免返回整个 state
- ✅ 使用 `useMemo` 缓存选择器结果（如果需要）
- ✅ 避免在组件中直接访问深层嵌套的 state

### 5. 错误处理

- ✅ 在 `createAsyncThunk` 中使用 `rejectWithValue` 返回错误信息
- ✅ 在 `extraReducers` 中处理 rejected 状态
- ✅ 在组件中检查 error 状态并显示错误信息

### 6. 开发体验

- ✅ 开发环境启用 redux-logger 和 Redux DevTools
- ✅ 使用有意义的 action 名称（格式：`module/actionName`）
- ✅ 保持 reducer 逻辑简单，复杂逻辑放在 thunk 中

## 常见问题

### Q: 为什么需要创建 `AppInner` 组件？

A: Redux hooks 只能在 `Provider` 内部使用。如果需要在应用启动时使用 hooks（如 `useLaunch`），需要创建一个内部组件。

### Q: 如何处理多个异步操作？

A: 为每个异步操作创建独立的 `createAsyncThunk`，并在 `extraReducers` 中分别处理它们的状态。

### Q: 如何重置 state？

A: 在 slice 的 reducers 中创建一个 reset action，将 state 重置为 `initialState`。

### Q: 如何在 thunk 中访问其他 slice 的 state？

A: 使用 `getState()` 获取整个 state，然后通过类型断言访问其他 slice：

```typescript
const state = getState() as RootState
const userInfo = state.user.userInfo
```

## 参考资源

- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)
- [Redux Toolkit TypeScript 指南](https://redux-toolkit.js.org/usage/usage-with-typescript)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
