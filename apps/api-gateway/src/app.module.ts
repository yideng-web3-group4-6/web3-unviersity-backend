import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserClientService } from './user/user-client.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), 'libs/contracts/proto/user.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserClientService],
})
export class AppModule {}
