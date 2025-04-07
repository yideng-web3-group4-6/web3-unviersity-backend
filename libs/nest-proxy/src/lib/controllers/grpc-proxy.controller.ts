// libs/nest-proxy/src/lib/controllers/grpc-proxy.controller.ts
import { ExecutionContext } from '@nestjs/common';
import { GrpcCaller } from '@libs/grpc/grpc-client';
export class GrpcProxyController<TClient extends GrpcCaller<any>> {
  constructor(protected readonly client: TClient) {}

  protected async proxy(
    method: string,
    context: ExecutionContext,
  ): Promise<any> {
    const payload = this.extractPayload(context);
    return this.client.call(method, payload);
  }

  private extractPayload(context: ExecutionContext): Record<string, any> {
    const req = context.switchToHttp().getRequest();
    const params = req.params ?? {};
    const query = req.query ?? {};
    const body = req.body ?? {};
    return { ...params, ...query, ...body };
  }
}
