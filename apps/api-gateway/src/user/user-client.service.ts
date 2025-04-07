import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcCaller } from '@libs/grpc/grpc-client';
import {
  UserService,
  USER_SERVICE_NAME,
  UserResponse,
} from '@contracts/ts/user.contract';

// 类型为定义结构，不是实现类

export interface IGrpcCaller<T extends Record<string, (...args: any) => any>> {
  call<K extends keyof T>(
    method: K,
    data: Parameters<T[K]>[0],
  ): Promise<Awaited<ReturnType<T[K]>>>;
}

@Injectable()
export class UserClientService extends GrpcCaller<UserService> {
  protected readonly logger = new Logger(UserClientService.name);

  private userService: IGrpcCaller<UserService>;

  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) {
    super(client.getService<UserService>(USER_SERVICE_NAME) as any);
    this.userService = this;
  }
  // Initialization logic is now handled by the parent class

  async getUser(id: string): Promise<UserResponse> {
    const response = await this.userService.call('GetUser', { id });

    if (!response?.id) {
      this.logger.warn(`用户不存在: id=${id}`);
      throw new NotFoundException('用户不存在');
    }

    return response;
  }
}
