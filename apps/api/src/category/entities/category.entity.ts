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
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Budget } from 'src/budget/entities/budget.entity';
import { RecurringTransaction } from 'src/recurring-transaction/entities/recurring-transaction.entity';

// Định nghĩa các loại danh mục
export enum CategoryType {
  INCOME = 'income', // Khoản thu
  EXPENSE = 'expense', // Khoản chi
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.EXPENSE,
  })
  type: CategoryType;

  /**
   * Tên của icon để hiển thị trên giao diện.
   * Ví dụ: 'food', 'transportation', 'salary'
   */
  @Column({ length: 50, nullable: true })
  icon: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // --- Mối quan hệ ---

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @OneToMany(() => RecurringTransaction, (rt) => rt.category)
  recurringTransactions: RecurringTransaction[];

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[];
}
