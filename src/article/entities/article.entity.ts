import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ default: 'draft' })
  status: string; // draft, published, archived

  @ManyToOne(() => User, { nullable: true })
  @Index()
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 多对多关系: 用户喜欢文章
  @ManyToMany(() => User, (user) => user.likedArticles)
  @JoinTable({
    name: 'article_likes',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  likedBy: User[];

  // 多对多关系: 用户收藏文章
  @ManyToMany(() => User, (user) => user.favoritedArticles)
  @JoinTable({
    name: 'article_favorites',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  favoritedBy: User[];
}
