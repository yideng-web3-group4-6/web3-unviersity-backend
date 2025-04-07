# Serverless 项目最佳实践文档（基于 AWS SAM + Nx + NestJS）

## 🏗️ 1. 项目结构设计

推荐使用 Nx Workspace + SAM：

```
my-nx-app/
├── apps/
│   ├── user-service/        # 独立 Lambda 服务
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   └── main.lambda.ts
├── libs/
│   └── contracts/           # DTO、事件契约、接口定义
├── template.yaml            # SAM 部署模板
```

## ⚙️ 2. 构建方式推荐（esbuild）

Nx + `@nx/esbuild:esbuild`：

```json
{
  "executor": "@nx/esbuild:esbuild",
  "options": {
    "main": "apps/user-service/src/main.lambda.ts",
    "outputPath": "dist/apps/user-service",
    "bundle": true,
    "platform": "node",
    "target": "node20"
  }
}
```

## ☁️ 3. AWS SAM 模板配置

```yaml
Resources:
  UserFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: dist/apps/user-service/
      Handler: main.lambda.handler
      Runtime: nodejs20.x
```

## 🚀 4. 本地构建 + 部署流程

```bash
pnpm nx build user-service
sam local start-api
sam deploy --guided
```

## 🧠 5. 契约管理与通信模式

```ts
// libs/contracts/events/user-created.event.ts
export interface IUserCreatedEvent {
  id: string;
  name: string;
  email: string;
}
```

发布事件：

```ts
await eventBridge.send(new PutEventsCommand({ ... }));
```

## 🔐 6. 安全性建议

- 使用 `.env` + `@nestjs/config`
- 配置 AWS IAM/KMS/SSM
- API Gateway 使用 JWT authorizer
- Helmet + CORS 防护

## 🔍 7. 可观测性 & 健壮性

| 项目 | 实践方式 |
|------|----------|
| 日志 | nestjs-pino / winston |
| 链路追踪 | AWS X-Ray |
| 熔断 | opossum |
| 限流 | nestjs-rate-limiter / API Gateway |
| 重试 | axios-retry / SQS retry policy |

## 📦 8. CI/CD 自动部署

`.github/workflows/deploy.yml`

```yaml
- name: Build Lambda
  run: pnpm nx build user-service

- name: Deploy with SAM
  run: sam deploy --no-confirm-changeset ...
```

## 🧩 9. 推荐工具

| 工具 | 用途 |
|------|------|
| `@vendia/serverless-express` | 适配 Lambda |
| `@aws-sdk/client-eventbridge` | 事件驱动 |
| `@nx/esbuild` | 快速构建 |
| `aws-lambda-powertools` | 日志/追踪/指标 |

---

> 本文档由 Nx + NestJS 架构指导编写，适用于单体服务解耦、多服务协作、Serverless 微服务落地等场景。
