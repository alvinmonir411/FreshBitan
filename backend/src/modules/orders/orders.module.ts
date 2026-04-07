import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, Product, ProductOption } from '../../entities';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, ProductOption])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
