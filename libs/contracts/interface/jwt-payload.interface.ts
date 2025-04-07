export interface JwtPayload {
  /**
   * JWT 标准字段，代表用户唯一标识，一般为 userId 或 walletAddress
   */
  sub: string;

  /**
   * 用户钱包地址，业务中常用于关联身份
   */
  walletAddress: string;

  /**
   * 用户角色（可选），例如 ['admin', 'user']
   */
  roles?: string[];

  /**
   * JWT 签发时间（可选）
   */
  iat?: number;

  /**
   * JWT 过期时间（可选）
   */
  exp?: number;
}
