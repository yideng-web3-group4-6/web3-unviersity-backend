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

  @Column({ type: 'varchar', unique: true })
  fileId: string;

  @Column({ type: 'varchar' })
  originalName: string;

  @Column({ type: 'varchar' })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'varchar' })
  bucket: string;

  @Column({ type: 'varchar' })
  region: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
