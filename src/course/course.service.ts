// src/course/course.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ContractService } from '../contract/contract.service';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(private readonly contractService: ContractService) {}

  async purchaseCourse(
    courseId: string,
    buyerAddress: string,
    ethAmount: string,
  ): Promise<any> {
    try {
      // 调用合约上链方法（此处只使用了支付 ETH 的逻辑，可扩展记录 buyerAddress、courseId 信息）
      const txReceipt = await this.contractService.buyCourseWithETH(ethAmount);
      // TODO: 可将购买记录存入数据库
      return {
        message: `课程 ${courseId} 购买成功`,
        txReceipt,
      };
    } catch (error) {
      this.logger.error(`购买课程失败: ${error}`);
      throw error;
    }
  }
}
