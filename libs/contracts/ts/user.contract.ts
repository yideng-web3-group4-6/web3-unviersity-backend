export const USER_SERVICE_NAME = 'UserService';
/**
 * 用户服务契约定义（目前采用纯 TypeScript 类型）
 * ✅ 后续可升级为 `.proto` 文件并用 ts-proto 生成类型结构
 *
 * proto 结构建议：
 * service UserService {
 *   rpc GetUser (GetUserRequest) returns (UserResponse);
 *   rpc CreateUser (CreateUserRequest) returns (UserResponse);
 * }
 */

export interface GetUserRequest {
  id: string;
}

export interface CreateUserRequest {
  name: string;
}

export interface UserResponse {
  id: string;
  name: string;
}

export interface UserService {
  [methodName: string]: any;
  getUser(input: GetUserRequest): Promise<UserResponse>;
  createUser(input: CreateUserRequest): Promise<UserResponse>;
}
