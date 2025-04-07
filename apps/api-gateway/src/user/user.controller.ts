// apps/api-gateway/src/user/user.controller.ts
import { Controller, ExecutionContext, Req } from '@nestjs/common';
import { UserClientService } from './user-client.service';
import { GrpcProxyController, GrpcHttpProxy } from '@libs/nest-proxy';

@Controller('user')
export class UserController extends GrpcProxyController<UserClientService> {
  constructor(protected override readonly client: UserClientService) {
    super(client);
  }

  @GrpcHttpProxy({ grpcMethod: 'GetUser', httpMethod: 'get', path: ':id' })
  async getUser(@Req() req, context: ExecutionContext) {
    return this.proxy('GetUser', context);
  }

  @GrpcHttpProxy({ grpcMethod: 'CreateUser', httpMethod: 'post' })
  async createUser(@Req() req, context: ExecutionContext) {
    return this.proxy('CreateUser', context);
  }

  @GrpcHttpProxy({ grpcMethod: 'UpdateUser', httpMethod: 'post' })
  async updateUser(@Req() req, context: ExecutionContext) {
    return this.proxy('UpdateUser', context);
  }
}
