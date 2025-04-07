// libs/nest-proxy/src/lib/decorators/grpc-http-proxy.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { Get, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export interface GrpcHttpProxyOptions {
  grpcMethod: string;
  httpMethod?: 'get' | 'post';
  path?: string;
  serviceName?: string;
}

export function GrpcHttpProxy(options: GrpcHttpProxyOptions): MethodDecorator {
  const httpMethod = options.httpMethod || 'get';
  const path = options.path ?? options.grpcMethod;
  const serviceName = options.serviceName || 'UserService';

  const httpDecorator = httpMethod === 'get' ? Get(path) : Post(path);
  const grpcDecorator = GrpcMethod(serviceName, options.grpcMethod);

  return applyDecorators(httpDecorator, grpcDecorator);
}
