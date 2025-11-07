import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';

export enum AttachmentType {
  IMAGE = 'image',
  PDF = 'pdf',
  OTHER = 'other',
}

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Đường dẫn (URL) tới file được lưu trên cloud (S3, Cloudinary...).
   */
  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: AttachmentType,
    default: AttachmentType.IMAGE,
  })
  type: AttachmentType;

  @Column({ length: 255, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // --- Mối quan hệ ---

  @ManyToOne(() => Transaction, (transaction) => transaction.attachments, {
    onDelete: 'CASCADE', // Khi giao dịch bị xóa, file đính kèm cũng bị xóa
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
