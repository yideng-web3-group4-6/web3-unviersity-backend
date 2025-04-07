import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UnauthorizedException,
  UseGuards,
  Put,
  Req,
  Param,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { GrpcMethod } from '@nestjs/microservices';

// 添加 Rpc 装饰器：判断是否为 gRPC 请求
export const Rpc = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.getType() === 'rpc';
  },
);

// 在类 UserController 中添加统一响应封装函数
function wrapResponse<T>(data: T, message = 'success', status = 200) {
  return { data, message, status };
}

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetNonce')
  @Get('nonce')
  async getNonce(
    @Query('walletAddress') walletAddress: string,
    @Body() body: { walletAddress?: string },
    @Rpc() isGrpc: boolean,
  ) {
    const address = isGrpc ? body.walletAddress : walletAddress;
    if (!address) {
      throw new UnauthorizedException('缺少钱包地址');
    }
    const nonce = await this.userService.generateNonce(address);
    return wrapResponse({ nonce });
  }

  @Post('login')
  @ApiOperation({
    summary: '使用签名登录，返回 JWT',
    description:
      '通过钱包地址和签名验证用户身份，验证成功后返回 JWT token 用于后续请求鉴权。',
  })
  @ApiBody({
    type: LoginDto,
    description: '用户登录请求参数，包含钱包地址和签名。',
  })
  @ApiResponse({
    status: 200,
    description: '登录成功，返回 JWT token',
    schema: { example: { access_token: 'JWT_TOKEN_EXAMPLE' } },
  })
  @ApiResponse({ status: 401, description: '签名验证失败' })
  async login(
    @Body() body: { walletAddress: string; signature: string },
    @Rpc() isGrpc: boolean,
  ) {
    const { walletAddress, signature } = body;
    const token = await this.userService.validateUser(walletAddress, signature);
    return wrapResponse({ access_token: token });
  }

  @GrpcMethod('UserService', 'UpdateProfile')
  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '更新用户个人信息',
    description:
      '更新当前登录用户的个人信息，如昵称、头像、邮箱等，支持 REST 与 gRPC',
  })
  @ApiBody({
    schema: {
      example: {
        walletAddress: '0x1234567890abcdef',
        nickname: '昵称',
        avatar: 'https://example.com/avatar.png',
      },
    },
    description:
      '更新信息字段，包括 walletAddress（gRPC 调用时提供）与其他用户字段',
  })
  @ApiResponse({
    status: 200,
    description: '用户信息更新成功',
    schema: { example: { message: '用户信息更新成功', data: {} } },
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async updateProfile(
    @Body() body: { walletAddress: string } & UpdateUserDto,
    @Req() req,
    @Rpc() isGrpc: boolean,
  ) {
    const walletAddress = isGrpc ? body.walletAddress : req.user.walletAddress;

    const { walletAddress: _, ...updateUserDto } = body;
    const updatedUser = await this.userService.updateUserInfo(
      walletAddress,
      updateUserDto,
    );
    return wrapResponse({ message: '用户信息更新成功', data: updatedUser });
  }

  @GrpcMethod('UserService', 'GetUser')
  @Get(':id')
  @ApiOperation({
    summary: '获取用户信息（REST + gRPC）',
    description: '根据用户 ID 获取用户信息，支持 REST 和 gRPC 调用',
  })
  @ApiResponse({
    status: 200,
    description: '成功返回用户信息',
    schema: {
      example: {
        data: {
          id: 1,
          name: '用户昵称',
          walletAddress: '0x123456',
        },
        status: 200,
        message: 'success',
      },
    },
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async getUser(
    @Param('id') paramId: string,
    @Body() body: { id?: string },
    @Rpc() isGrpc: boolean,
  ) {
    const id = isGrpc ? body.id : paramId;

    const user = await this.userService.findUserbyId(id);
    return wrapResponse({
      id: user.id,
      name: user.nickname || '',
      walletAddress: user.walletAddress,
    });
  }
}
