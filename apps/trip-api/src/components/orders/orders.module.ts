import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import OrderSchema from '../../schemas/Orders.model';
import { PropertyModule } from '../property/property.module';
import { MemberModule } from '../member/member.module';
import { OrderService } from './orders.service';
import { OrderResolver } from './orders.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    PropertyModule,
    MemberModule,
  ],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
