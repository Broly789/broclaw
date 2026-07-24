# AGENTS.md

## Project

Broclaw — Broclaw 配置管理平台。Monorepo 结构，含 NestJS 后端 API 和 Ant Design Pro 前端。

## Workspace

| Package | Manager | Path |
|---------|---------|------|
| `@broclaw/web` | npm | `apps/web/` |
| `@broclaw/api` | pnpm | `apps/api/` |

## Commands

```bash
npm run lint          # lint all workspaces
npm run build         # build all workspaces
npm run web:start     # start frontend only
```

## Skills

Load these skills by name when the task matches their description:

| Skill | Triggers |
|-------|----------|
| `nestjs-best-practices` | Writing NestJS code, DI, error handling, security |
| `zod` | Schema validation, z.object, z.infer, safeParse |
| `antd` | Ant Design components, props, API, usage |
| `pro-upgrade` | Upgrading Ant Design Pro version |

## Cross-cutting Rules

- **Conventional commits** required
- **Node ≥ 18**
- Each app has its own `AGENTS.md` — read that for app-specific guidance
