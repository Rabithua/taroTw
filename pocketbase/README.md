# PocketBase 本地开发

项目集成了 PocketBase 作为后端服务，使用 Docker 运行。

## 启动 PocketBase

```bash
# 启动 PocketBase 服务
bun run dev:pb

# 停止 PocketBase 服务
bun run dev:pb:stop

# 查看日志
bun run dev:pb:logs

# 重启服务
bun run dev:pb:restart
```

## 访问地址

- **API 地址**: http://localhost:8090
- **管理界面**: http://localhost:8090/\_/（首次访问会显示设置向导）

## 初始 Superuser 账户

PocketBase **没有默认的 superuser 账户**，首次启动需要创建：

**方式 1：通过管理界面创建（推荐）**

1. 启动服务后，访问 http://localhost:8090/\_/
2. 首次访问会显示设置向导，按提示创建第一个 superuser 账户

**方式 2：通过环境变量自动创建**

在 `docker-compose.yml` 中取消注释环境变量部分，设置邮箱和密码：

```yaml
environment:
  PB_ADMIN_EMAIL: admin@example.com
  PB_ADMIN_PASSWORD: your-secure-password
```

**方式 3：通过 CLI 命令创建**

```bash
# 进入容器
docker exec -it pocketbase sh

# 创建 superuser
/pb/pocketbase superuser create admin@example.com your-password
```

## 数据持久化

PocketBase 的数据存储在 `./pocketbase/pb_data` 目录中，该目录已通过 Docker 卷挂载，确保数据在容器重启后仍然保留。

## 数据库迁移（Migrations）

项目支持使用 PocketBase Migrations 来管理数据库结构，确保部署时自动初始化数据结构。

### 创建迁移文件

1. **通过管理界面创建结构**：在本地开发时，通过管理界面（http://localhost:8090/\_/）创建所有需要的集合和字段

2. **导出迁移文件**（推荐）：

   ```bash
   # 进入容器
   docker exec -it pocketbase sh

   # 使用 PocketBase CLI 创建迁移
   /pb/pocketbase migrate create
   ```

3. **手动编写迁移文件**：参考 `pocketbase/pb_migrations/1728201600_initial.js` 示例

### 迁移文件说明

- 迁移文件位于 `pocketbase/pb_migrations/` 目录
- 文件命名格式：`{timestamp}_{description}.js`
- 在容器启动时，PocketBase 会自动执行所有未执行的迁移
- 迁移文件会被打包到 Docker 镜像中，确保生产环境的一致性

### 部署流程

1. 在本地开发并创建好所有集合结构
2. 创建或导出迁移文件到 `pocketbase/pb_migrations/`
3. 提交迁移文件到 Git
4. 部署时，Docker 会自动将迁移文件打包到镜像
5. 容器启动时，PocketBase 会自动执行迁移，初始化数据库结构

## 目录结构

```
pocketbase/
├── Dockerfile              # Docker 镜像构建文件
├── README.md               # 本文档
├── pb_data/                # 数据目录（不提交到 Git）
│   └── .gitkeep
└── pb_migrations/           # 数据库迁移文件
    ├── README.md           # 迁移文件使用说明
    └── 1728201600_initial.js  # 示例迁移文件
```
