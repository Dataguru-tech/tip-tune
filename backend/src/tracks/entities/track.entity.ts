import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  artist: string;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 500 })
  streamingUrl: string;

  @Column({ type: 'bigint' })
  fileSize: bigint;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  genre: string;

  @Column({ length: 255, nullable: true })
  album: string;

  @Column({ type: 'int', default: 0 })
  playCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
