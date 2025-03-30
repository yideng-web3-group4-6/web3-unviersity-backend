// src/user/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '用户钱包地址' })
  walletAddress: string;

  @ApiProperty({ description: '用户签名' })
  signature: string;

  @ApiProperty({ description: '服务器下发的随机 nonce' })
  nonce: string;
}
