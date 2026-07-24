# AGENTS.md

## Project

NestJS 后端 API — Broclaw 配置管理平台的数据层。

## Stack

NestJS 11 · Zod + nestjs-zod · @nestjs/swagger · class-transformer

## Skills

Load when relevant:

- `nestjs-best-practices` — architecture, DI, error handling, security
- `zod` — schema validation, z.object, z.infer, refinements

## Commands

```bash
npm run start:dev  # watch mode, port 3000
npm run start:prod # production
npm run build      # compile to dist/
npm run test       # unit tests
npm run test:e2e   # e2e tests
```

## Architecture

```
src/
├── main.ts                       # entry: CORS + ZodValidationPipe + Swagger
├── app.module.ts                 # root module
├── agents/                       # feature module
│   ├── agents.module.ts
│   ├── agents.controller.ts      # GET/POST /agents/config
│   ├── agents.service.ts         # read/write ~/.broclaw/broclaw.json
│   ├── dto/
│   │   ├── agents.schema.ts      # Zod schemas + createZodDto classes
│   │   └── config-response.dto.ts # Swagger response DTOs
│   └── interfaces/
│       ├── agents-config.interface.ts  # flat frontend format
│       └── broclaw-storage.interface.ts  # openclaw-like storage format
```

## API Rules

- **Global pipe**: `ZodValidationPipe` (strip unknown, no forbidNonWhitelisted)
- **CORS** enabled
- **Swagger** at `/docs`
- **Response wrapper**: `{ data: T }` for GET, `{ data: T, success: boolean }` for POST
- **Validation**: Zod schemas only — no class-validator
- **DTO**: `createZodDto(Schema)` → class for Swagger compat; `z.infer` for types

## Storage

- Data persisted at `~/.broclaw/broclaw.json`
- Format follows openclaw-like structure: `models.providers`, `agents.list`, `tools.custom`
- Two-layer transform: storage ↔ flat frontend format (in `AgentsService`)
- Handles missing file / missing sections gracefully — returns defaults

## Conventions

### Feature Module
- One directory per feature: `agents/`, `users/`, etc.
- Module, controller, service in feature root
- DTOs in `dto/`, interfaces in `interfaces/`
- Feature module imported into `AppModule`

### DI
- Constructor injection only
- `@Injectable()` on all services
- Single-responsibility services — no god services

### Validation
- `ZodValidationPipe` globally — no per-route pipes
- Zod schema `partial()` / `.optional()` for partial updates
- Custom error messages on `.min(1, 'xxx')`

### Error Handling
- Throw `NotFoundException`, `InternalServerErrorException` from services
- Let the framework exception filter handle formatting
- Logger for service-level errors

## Project Config

- `nest-cli.json`: `deleteOutDir: true`
- `main.ts`: CORS + ZodValidationPipe + Swagger
- Port via `process.env.PORT ?? 3000`
