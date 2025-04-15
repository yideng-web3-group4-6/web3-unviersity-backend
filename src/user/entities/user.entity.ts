import { Article } from '../../article/entities/article.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
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

  // 多对多关系: 用户喜欢文章
  @ManyToMany(() => Article, (article) => article.likedBy)
  likedArticles: Article[];

  @ManyToMany(() => Article, (article) => article.favoritedBy)
  favoritedArticles: Article[];
}
