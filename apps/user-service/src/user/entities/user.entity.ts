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

  @Column('varchar', { unique: true })
  walletAddress: string;

  @Column('varchar', { default: '' })
  nonce: string;

  @Column('varchar', { default: 'user' })
  role: string; // 如 'admin'、'teacher'、'user'

  // 扩展字段
  @Column('varchar', { nullable: true })
  nickname: string;

  @Column('varchar', { nullable: true })
  avatarUrl: string;

  @Column('varchar', { nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
