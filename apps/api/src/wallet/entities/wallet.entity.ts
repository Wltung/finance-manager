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
import { RecurringTransaction } from 'src/recurring-transaction/entities/recurring-transaction.entity';

// Định nghĩa các loại ví để quản lý bằng ENUM
export enum WalletType {
  CASH = 'cash',
  BANK_ACCOUNT = 'bank_account',
  CREDIT_CARD = 'credit_card',
}

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: WalletType,
    default: WalletType.CASH,
  })
  type: WalletType;

  /**
   * Số dư của ví.
   * Nên dùng kiểu 'decimal' để đảm bảo tính chính xác tuyệt đối cho các phép tính tài chính.
   * precision: tổng số chữ số.
   * scale: số chữ số sau dấu phẩy.
   */
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // --- Định nghĩa các mối quan hệ ---

  /**
   * Quan hệ Nhiều-Một: Nhiều ví thuộc về một người dùng.
   * onDelete: 'CASCADE' => Khi user bị xóa, các ví của user đó cũng sẽ bị xóa theo.
   */
  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Tên cột foreign key trong bảng 'wallets'
  user: User;

  /**
   * Quan hệ Một-Nhiều: Một ví có thể có nhiều giao dịch.
   */
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  /**
   * Quan hệ Một-Nhiều: Một ví có thể có nhiều giao dịch định kỳ.
   */
  @OneToMany(() => RecurringTransaction, (recurring) => recurring.wallet)
  recurringTransactions: RecurringTransaction[];
}
