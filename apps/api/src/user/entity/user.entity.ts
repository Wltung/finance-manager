import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Entity,
} from 'typeorm';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Category } from 'src/category/entities/category.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Budget } from 'src/budget/entities/budget.entity';
import { RecurringTransaction } from 'src/recurring-transaction/entities/recurring-transaction.entity';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';

@Entity("user")
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ default: 1 })
  tokenVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => RecurringTransaction, (recurring) => recurring.user)
  recurringTransactions: RecurringTransaction[];

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];
}
