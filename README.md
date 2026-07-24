# Broclaw

Broclaw 配置管理平台 — OpenClaw 的 Web 管理界面。

## 项目结构

```
broclaw/
├── apps/
│   ├── api/         NestJS 后端 (端口 3000)
│   │   ├── src/
│   │   │   ├── agents/     agents 功能模块
│   │   │   ├── main.ts     启动入口
│   │   │   └── app.module.ts
│   │   └── package.json     pnpm
│   └── web/         Ant Design Pro 前端 (端口 8000)
│       ├── src/
│       │   └── pages/agents/   agents 配置页面
│       └── package.json        npm
├── packages/         共享包
└── package.json      根 workspace
```

## 快速开始

```bash
# 后端 (终端 1)
cd apps/api
pnpm install
pnpm start:dev

# 前端 (终端 2)
cd apps/web
npm install
npm start
```

浏览器打开 `http://localhost:8000`，前端自动代理 `/api/*` 到后端。

## API 文档

启动后端后访问 `http://localhost:3000/docs` 可在线测试接口。

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | NestJS 11 · Zod · Swagger |
| 前端 | Umi Max v4 · antd v6 · Tailwind CSS v4 |
| 存储 | `~/.broclaw/broclaw.json` |
| 包管理 | npm (workspace) + pnpm (api) |
