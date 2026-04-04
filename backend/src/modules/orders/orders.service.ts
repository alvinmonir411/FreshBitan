import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { DataSource, In, Repository } from 'typeorm';
import { PaymentMethod } from '../../common/enums/payment-method.enum';
import { Order, OrderItem, Product } from '../../entities';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    if (createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item.');
    }

    const productIds = [
      ...new Set(createOrderDto.items.map((item) => item.productId)),
    ];
    const products = await this.productsRepository.find({
      where: {
        id: In(productIds),
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'One or more selected products are unavailable.',
      );
    }

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );
    const deliveryFee = createOrderDto.deliveryFee ?? 0;

    const lineItems = createOrderDto.items.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new BadRequestException(
          'One or more selected products are unavailable.',
        );
      }

      const unitPrice = product.discountedPrice ?? product.price;
      const subtotal = Number((unitPrice * item.quantity).toFixed(2));

      return {
        product,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      };
    });

    const subtotal = Number(
      lineItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
    );
    const totalAmount = Number((subtotal + deliveryFee).toFixed(2));

    const savedOrderId = await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const orderItemRepository = manager.getRepository(OrderItem);

      const order = orderRepository.create({
        orderNumber: this.generateOrderNumber(),
        customerName: createOrderDto.customerName,
        customerEmail: createOrderDto.customerEmail ?? null,
        customerPhone: createOrderDto.customerPhone,
        shippingAddress: createOrderDto.shippingAddress,
        district: createOrderDto.district ?? null,
        area: createOrderDto.area ?? null,
        notes: createOrderDto.notes ?? null,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod:
          createOrderDto.paymentMethod ?? PaymentMethod.CASH_ON_DELIVERY,
      });

      const savedOrder = await orderRepository.save(order);
      const orderItems = lineItems.map((item) =>
        orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }),
      );

      await orderItemRepository.save(orderItems);

      return savedOrder.id;
    });

    return this.findOneOrFail(savedOrderId);
  }

  findAll() {
    return this.ordersRepository.find({
      relations: {
        items: {
          product: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneOrFail(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOneOrFail(id);
    order.status = updateOrderStatusDto.status;

    await this.ordersRepository.save(order);
    return this.findOneOrFail(order.id);
  }

  async updatePaymentStatus(
    id: string,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const order = await this.findOneOrFail(id);
    order.paymentStatus = updatePaymentStatusDto.paymentStatus;

    await this.ordersRepository.save(order);
    return this.findOneOrFail(order.id);
  }

  private generateOrderNumber() {
    return `FB-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  }
}
