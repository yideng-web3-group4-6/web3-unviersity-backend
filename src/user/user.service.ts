// src/user/user.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { verifyMessage } from 'ethers/lib/utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 查找用户，如果不存在则创建新用户
   * @param walletAddress 用户钱包地址
   * @returns User 实体
   */
  async findOrCreateUser(walletAddress: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { walletAddress } });
    if (!user) {
      user = this.userRepository.create({ walletAddress, role: 'user' });
      user = await this.userRepository.save(user);
      this.logger.log(`Created new user with wallet address: ${walletAddress}`);
    }
    return user;
  }

  /**
   * 生成随机 nonce 并保存到用户记录中
   * @param walletAddress 用户钱包地址
   * @returns 生成的 nonce 字符串
   */
  async generateNonce(walletAddress: string): Promise<string> {
    const user = await this.findOrCreateUser(walletAddress);
    // 如果用户已有有效 nonce，则复用它（防止频繁签名）
    if (user.nonce && user.nonce.length > 0) {
      return user.nonce;
    }
    const nonce = Math.random().toString(36).substring(2, 15); // 生成随机字符串
    user.nonce = nonce;
    await this.userRepository.save(user);
    return nonce;
  }

  /**
   * 验证用户签名，成功后生成 JWT token
   * @param walletAddress 用户钱包地址
   * @param signature 用户用钱包对 nonce 签名后的结果
   * @returns JWT token
   * @throws UnauthorizedException 如果用户不存在或签名验证失败
   */
  async validateUser(
    walletAddress: string,
    signature: string,
  ): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { walletAddress },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // 使用 ethers.verifyMessage 验证签名是否有效
    let recoveredAddress: string;
    try {
      recoveredAddress = verifyMessage(user.nonce, signature);
      console.log('🚀 ~ UserService ~ recoveredAddress:', recoveredAddress);
      console.log('🚀 ~ UserService ~ walletAddress:', walletAddress);
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new UnauthorizedException('Signature verification failed');
    }
    try {
      user.nonce = '';
      await this.userRepository.save(user);
    } catch (err) {
      this.logger.error('Failed to save user nonce:', err);
      throw new UnauthorizedException('Server error');
    }

    try {
      const payload = { walletAddress: user.walletAddress, role: user.role };
      return this.jwtService.sign(payload);
    } catch (err) {
      this.logger.error('Failed to generate JWT token:', err);
      throw new UnauthorizedException('Token generation failed');
    }
  }

  /**
   * 更新用户个人信息
   * @param walletAddress 当前用户的钱包地址
   * @param updateUserDto 要更新的用户信息数据
   * @returns 更新后的 User 实体
   * @throws NotFoundException 如果用户不存在
   */
  async updateUserInfo(
    walletAddress: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { walletAddress },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * 生成登录后的 JWT token（辅助方法，通常在 validateUser 中调用）
   * @param user 用户实体
   * @returns 包含 access_token 的对象
   */
  async login(user: User): Promise<{ access_token: string }> {
    const payload = {
      walletAddress: user.walletAddress,
      role: user.role,
      id: user.id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
