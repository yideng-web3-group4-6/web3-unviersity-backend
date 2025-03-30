import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  walletAddress: string;

  @Column({ default: '' })
  nonce: string;

  @Column({ default: 'user' })
  role: string; // 如 'admin'、'teacher'、'user'

  // 扩展字段
  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
