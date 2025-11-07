import { Module } from '@nestjs/common';
import { RecurringTransactionService } from './recurring-transaction.service';
import { RecurringTransactionController } from './recurring-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringTransaction } from './entities/recurring-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecurringTransaction])],
  controllers: [RecurringTransactionController],
  providers: [RecurringTransactionService],
})
export class RecurringTransactionModule {}
