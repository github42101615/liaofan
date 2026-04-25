# Luxe Notes Blog

一个带高级感前台、可部署后端接口、PostgreSQL 数据库和轻量管理台的个人博客项目。

## 技术栈

- `Next.js 15` + `React 19` + `TypeScript`
- `Prisma` 作为 ORM
- `PostgreSQL` 作为数据库
- 原生 CSS 打造偏杂志化、电影感的视觉风格

## 已包含的能力

- 首页高级感展示
- 文章详情页
- `POST /api/posts` 创建文章
- `PATCH /api/posts/[slug]` 更新文章
- `DELETE /api/posts/[slug]` 删除文章
- `GET /api/posts` 获取文章列表
- `/admin` 管理台
- `Dockerfile` 和 `docker-compose.yml`，方便上服务器

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

```bash
cp .env.example .env
```

3. 初始化数据库

```bash
npx prisma migrate dev --name init
npm run db:seed
```

如果你只想快速同步结构，也可以先用：

```bash
npm run db:push
```

4. 启动开发环境

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 服务器部署

### 方案一：Docker 部署

1. 修改 `.env` 或 `docker-compose.yml` 里的数据库密码和 `ADMIN_SECRET`
2. 运行：

```bash
docker compose up -d --build
```

3. 首次部署后执行：

```bash
docker compose exec app npm run db:seed
```

### 方案二：Node + PostgreSQL

服务器准备：

- Node.js 20+
- PostgreSQL 15+
- Nginx 反向代理
- PM2 守护进程

部署步骤：

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

推荐再配合 `pm2`：

```bash
pm2 start npm --name luxe-notes -- run start
```

## 管理台说明

- 打开 `/admin`
- 输入你在环境变量中配置的 `ADMIN_SECRET`
- 可以创建、修改、删除文章
- 首页会自动展示 `featured=true` 的文章作为主视觉

## 后续建议

- 接入图片上传到 OSS / S3
- 增加登录鉴权，例如 NextAuth 或 Clerk
- 支持 Markdown 编辑器
- 增加标签、分类、SEO sitemap、RSS
