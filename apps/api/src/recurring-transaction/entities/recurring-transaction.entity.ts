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
import { Transaction } from 'src/transaction/entities/transaction.entity';

// Định nghĩa loại giao dịch
export enum RecurringType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Định nghĩa tần suất lặp lại
export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity()
export class RecurringTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RecurringFrequency,
    default: RecurringFrequency.MONTHLY,
  })
  frequency: RecurringFrequency;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  /**
   * Ngày tiếp theo mà giao dịch sẽ được tạo.
   * Cột này sẽ được cập nhật bởi một cron job.
   */
  @Column({ type: 'date', name: 'next_execution_date' })
  nextExecutionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // --- Mối quan hệ ---

  @ManyToOne(() => User, (user) => user.recurringTransactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.recurringTransactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Wallet, (wallet) => wallet.recurringTransactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  /**
   * Một mẫu giao dịch định kỳ sẽ "sinh ra" nhiều giao dịch thực tế.
   */
  @OneToMany(() => Transaction, (transaction) => transaction.recurringTransaction)
  transactions: Transaction[];
}
