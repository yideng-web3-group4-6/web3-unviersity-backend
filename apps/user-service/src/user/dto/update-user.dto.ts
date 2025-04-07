import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户昵称', example: '小明' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({
    description: '头像 URL',
    example: 'http://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: '电子邮件', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
