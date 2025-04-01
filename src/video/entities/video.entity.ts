import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('videoInfo')
export class VideoInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
