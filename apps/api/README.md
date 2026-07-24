# @broclaw/api

Broclaw 后端 API 服务 — NestJS 11

## 快速开始

```bash
pnpm install
pnpm start:dev
```

API 服务在 `http://localhost:3000`，Swagger 文档在 `http://localhost:3000/docs`。

## 目录结构

```
src/
├── main.ts              启动入口（CORS + 验证 + Swagger）
├── app.module.ts         根模块
├── agents/               agents 功能模块
│   ├── agents.controller.ts
│   ├── agents.service.ts
│   ├── agents.module.ts
│   ├── dto/               Zod schema + createZodDto 类
│   └── interfaces/         TS 类型定义
```

## 技术栈

- **框架**: NestJS 11
- **验证**: Zod + nestjs-zod
- **文档**: @nestjs/swagger (OpenAPI 3.0)
- **存储**: `~/.broclaw/broclaw.json`

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/agents/config` | 获取全部配置 |
| POST | `/agents/config` | 保存配置 |

---

更多细节见 `AGENTS.md`。
