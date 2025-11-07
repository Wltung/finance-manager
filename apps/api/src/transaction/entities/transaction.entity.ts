import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Attachment } from 'src/attachment/entities/attachment.entity';
import { RecurringTransaction } from 'src/recurring-transaction/entities/recurring-transaction.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 255, nullable: true })
  description: string;

  /**
   * Ngày giao dịch được thực hiện.
   */
  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // --- Mối quan hệ ---

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  /**
   * Quan hệ với giao dịch định kỳ.
   * `nullable: true` vì không phải giao dịch nào cũng là giao dịch định kỳ.
   * `onDelete: 'SET NULL'` => Khi mẫu giao dịch định kỳ bị xóa, các giao dịch
   * đã tạo ra từ nó vẫn được giữ lại nhưng không còn liên kết nữa.
   */
  @ManyToOne(() => RecurringTransaction, (recurring) => recurring.transactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'recurring_transaction_id' })
  recurringTransaction: RecurringTransaction;

  @OneToMany(() => Attachment, (attachment) => attachment.transaction)
  attachments: Attachment[];
}
