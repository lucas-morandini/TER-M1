import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeHash } from './entities/stripe-hash.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StripeHash]), ConfigModule, TypeOrmModule.forFeature([Payment]), UsersModule, TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, PaymentsService],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}