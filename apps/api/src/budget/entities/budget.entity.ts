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
import { User } from 'src/user/entity/user.entity';
import { Category } from 'src/category/entities/category.entity';

// Định nghĩa chu kỳ lặp lại của ngân sách
export enum BudgetPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity()
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Số tiền ngân sách đặt ra.
   */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: BudgetPeriod,
    default: BudgetPeriod.MONTHLY,
  })
  period: BudgetPeriod;

  /**
   * Ngày bắt đầu áp dụng ngân sách.
   * Dùng 'date' vì chúng ta không cần thông tin về thời gian.
   */
  @Column({ type: 'date' })
  startDate: Date;

  /**
   * Ngày kết thúc. Có thể là NULL nếu ngân sách không có ngày hết hạn.
   */
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // --- Mối quan hệ ---

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * Ngân sách này được áp dụng cho danh mục nào.
   */
  @ManyToOne(() => Category, (category) => category.budgets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
