// src/user/user.controller.ts
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

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('nonce')
  @ApiOperation({
    summary: '获取登录用 nonce',
    description: '通过传入钱包地址获取登录所需的随机 nonce 字符串。',
  })
  @ApiQuery({
    name: 'walletAddress',
    required: true,
    description: '用户的钱包地址',
    example: '0x1234567890abcdef',
  })
  @ApiResponse({ status: 200, description: '成功返回 nonce 字符串' })
  @ApiResponse({ status: 401, description: '缺少钱包地址或验证失败' })
  async getNonce(@Query('walletAddress') walletAddress: string) {
    if (!walletAddress) {
      throw new UnauthorizedException('缺少钱包地址');
    }
    const nonce = await this.userService.generateNonce(walletAddress);
    return { code: 200, message: '获取 nonce 成功', data: { nonce } };
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
  async login(@Body() body: { walletAddress: string; signature: string }) {
    const { walletAddress, signature } = body;
    const token = await this.userService.validateUser(walletAddress, signature);
    return { code: 200, message: '登录成功', data: { access_token: token } };
  }

  // 以下为更新用户信息接口，可根据需要启用
  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '更新用户个人信息',
    description: '更新当前登录用户的个人信息，如昵称、头像、邮箱等。',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: '用户更新个人资料的数据。',
  })
  @ApiResponse({
    status: 200,
    description: '用户信息更新成功',
    schema: { example: { message: '用户信息更新成功', data: {} } },
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const walletAddress = req.user.walletAddress;
    const updatedUser = await this.userService.updateUserInfo(
      walletAddress,
      updateUserDto,
    );
    return { code: 200, message: '用户信息更新成功', data: updatedUser };
  }
}
