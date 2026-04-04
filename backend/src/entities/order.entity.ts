import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../common/entities/base.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { numericColumnTransformer } from '../common/transformers/numeric-column.transformer';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order extends AppBaseEntity {
  @Column({ type: 'varchar', length: 40, unique: true })
  orderNumber!: string;

  @Column({ type: 'varchar', length: 120 })
  customerName!: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  customerEmail!: string | null;

  @Column({ type: 'varchar', length: 30 })
  customerPhone!: string;

  @Column({ type: 'text' })
  shippingAddress!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  district!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  area!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericColumnTransformer,
  })
  subtotal!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericColumnTransformer,
  })
  deliveryFee!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericColumnTransformer,
  })
  totalAmount!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status_enum',
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    enumName: 'payment_method_enum',
    default: PaymentMethod.CASH_ON_DELIVERY,
  })
  paymentMethod!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    enumName: 'payment_status_enum',
    default: PaymentStatus.PENDING,
  })
  paymentStatus!: PaymentStatus;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}
