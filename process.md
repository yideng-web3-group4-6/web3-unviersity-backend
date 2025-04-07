# 项目结构整理文档

## apps/api-gateway

聚合型网关服务，作为本地开发入口、RESTful 接口转发层。具备本地 mock、代理远程服务、统一鉴权等功能。

### 主要目录说明

- `src/main.ts`：Nest 启动文件（REST 入口）
- `src/app.module.ts`：主模块，加载各业务模块
- `src/user/`：聚合用户相关 API 的控制器和客户端
  - `user.controller.ts`：REST 控制器，支持通过 `userClient.call(...)` 调用远程服务
  - `user-client.service.ts`：基于 `IGrpcCaller<UserService>` 实现的统一调用封装（暂为 HTTP）

---

## apps/user-service

用户服务（业务微服务），独立部署，支持 REST 接口或 Serverless Lambda 接口。

### 主要目录说明

- `src/main.ts`：Nest 启动入口（REST 或 Lambda）
- `src/app.module.ts`：主模块，注册数据库与业务模块
- `src/user/`
  - `user.controller.ts`：对外暴露的 REST 控制器（用于测试/调用）
  - `user.service.ts`：实现了 `UserService` 接口的业务逻辑
  - `dto/`：请求 DTO 数据结构（如 `login.dto.ts`, `update.dto.ts`）
  - `entities/`：TypeORM 实体定义，如 `user.entity.ts`

---

## libs/contracts

- `user.contract.ts`：用户服务契约接口（代替 .proto），用于声明 `UserService` 接口和请求/响应结构。

---

## 当前进展与下一步建议

- [x] 建立 contracts 统一声明类型接口
- [x] user-service 可独立运行并支持类型接口开发
- [x] api-gateway 成功代理并统一调用结构（user-client）
- [ ] 计划支持基于 `GrpcHttpProxyController` 的声明式映射方式
- [ ] 封装统一异常拦截与 JWT 解码逻辑


---

## 🧱 项目架构描述

本项目采用 Nx + NestJS + pnpm 构建 Serverless 架构的多服务微服务系统。

- 每个子服务位于 `apps/` 下，支持单独运行与部署
- `libs/contracts/` 提供跨服务共享的 TS 类型接口（后续可迁移为 .proto）
- 通信模式默认基于 REST，可扩展为 gRPC 或 GraphQL
- 架构支持本地开发与 AWS Lambda 部署场景切换（通过 main.ts/main.lambda.ts 区分）
- 所有控制器支持统一封装（GrpcHttpProxyController 等）

---

## 🪛 开发过程问题记录与进度追踪

### 已解决的问题

- [x] `protoc` 在 macOS 环境下安装失败 → 使用 TypeScript 接口替代 `.proto`
- [x] `ts-proto` 类型不兼容 → 改为手写 `UserService` 接口并共享使用
- [x] 泛型继承冲突：`UserClientService` 与 `GrpcCaller` → 通过接口 `IGrpcCaller` 解耦
- [x] Nx 应用未正确识别 → 手动调整 `project.json` 与路径结构
- [x] gRPC 本地调试与 HTTP 部署方式冲突 → 使用 main.ts / main.grpc.ts 分离环境
- [x] 创建并绑定统一契约结构（`user.contract.ts`）

### 当前进行中任务

- [ ] 添加统一响应封装（`wrapResponse()` 工具）
- [ ] 接入 JWT 签发与验证逻辑（基于 `@nestjs/jwt`）
- [ ] 封装统一异常拦截器（如 `RpcExceptionFilter`）
- [ ] 支持本地 gRPC + 线上 HTTP 环境切换逻辑（动态调用实现）
- [ ] 接入 `GrpcHttpProxyController` 实现声明式映射，自动代理
- [ ] 完善部署流程，定义每个 Lambda 的 `template.yaml` 并集成 SAM 构建
