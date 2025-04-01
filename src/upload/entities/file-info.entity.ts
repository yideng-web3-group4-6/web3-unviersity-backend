import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('fileInfo')
export class FileInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fileId: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  key: string;

  @Column()
  bucket: string;

  @Column()
  region: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
