import { Logger } from '@nestjs/common';
import {
  lastValueFrom,
  Observable,
  timeout,
  catchError,
  throwError,
} from 'rxjs';

export type GrpcServiceDefinition = Record<
  string,
  (data: any) => Observable<any>
>;

export class GrpcCaller<T extends GrpcServiceDefinition> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(private readonly service: T) {}

  call<K extends keyof T>(
    method: K,
    data: Parameters<T[K]>[0],
    options?: { timeoutMs?: number },
  ): Promise<Awaited<ReturnType<T[K]>>> {
    const obs$ = this.service[method](data).pipe(
      timeout(options?.timeoutMs ?? 3000),
      catchError((err) => {
        this.logger.error(`gRPC 调用 ${String(method)} 超时或失败`, err);
        return throwError(() => err);
      }),
    );
    return lastValueFrom(obs$);
  }
}
