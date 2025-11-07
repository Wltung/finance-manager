import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/config/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { WalletModule } from './wallet/wallet.module';
import { BudgetModule } from './budget/budget.module';
import { TransactionModule } from './transaction/transaction.module';
import { RecurringTransactionModule } from './recurring-transaction/recurring-transaction.module';
import { AttachmentModule } from './attachment/attachment.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    WalletModule,
    BudgetModule,
    TransactionModule,
    RecurringTransactionModule,
    AttachmentModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
