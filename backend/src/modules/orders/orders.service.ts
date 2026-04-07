import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { DataSource, In, Repository } from 'typeorm';
import { PaymentMethod } from '../../common/enums/payment-method.enum';
import { Order, OrderItem, Product, ProductOption } from '../../entities';
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
      relations: {
        options: true,
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

      const activeOptions = (product.options ?? []).filter(
        (option) => option.isActive,
      );
      const defaultOption =
        activeOptions.find((option) => option.isDefault) ?? activeOptions[0];

      if (activeOptions.length > 1 && !item.productOptionId) {
        throw new BadRequestException(
          `Please select a purchase option for ${product.name}.`,
        );
      }

      const selectedOption = item.productOptionId
        ? activeOptions.find((option) => option.id === item.productOptionId)
        : defaultOption;

      if (item.productOptionId && !selectedOption) {
        throw new BadRequestException(
          `Selected purchase option is unavailable for ${product.name}.`,
        );
      }

      const unitPrice =
        selectedOption?.discountedPrice ??
        selectedOption?.price ??
        product.discountedPrice ??
        product.price;
      const subtotal = Number((unitPrice * item.quantity).toFixed(2));

      const availableStock =
        selectedOption?.stockQuantity ?? product.stockQuantity ?? 0;

      if (item.quantity > availableStock) {
        throw new BadRequestException(
          `${product.name} does not have enough stock for the selected pack size.`,
        );
      }

      return {
        product,
        selectedOption: selectedOption ?? null,
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
          productOptionId: item.selectedOption?.id ?? null,
          productName: item.product.name,
          optionLabel: item.selectedOption?.label ?? null,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }),
      );

      await orderItemRepository.save(orderItems);
      await this.applyStockAdjustments(lineItems, manager);

      return savedOrder.id;
    });

    return this.findOneOrFail(savedOrderId);
  }

  findAll() {
    return this.ordersRepository.find({
      relations: {
        items: {
          product: true,
          productOption: true,
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
          productOption: true,
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

  private async applyStockAdjustments(
    lineItems: Array<{
      product: Product;
      selectedOption: ProductOption | null;
      quantity: number;
    }>,
    manager: DataSource['manager'],
  ) {
    const productAdjustments = new Map<string, number>();

    for (const item of lineItems) {
      productAdjustments.set(
        item.product.id,
        (productAdjustments.get(item.product.id) ?? 0) + item.quantity,
      );

      if (!item.selectedOption) {
        const latestProduct = await manager.getRepository(Product).findOne({
          where: { id: item.product.id },
        });

        if (!latestProduct || latestProduct.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `${item.product.name} is no longer available in the requested quantity.`,
          );
        }

        latestProduct.stockQuantity -= item.quantity;
        await manager.getRepository(Product).save(latestProduct);
        continue;
      }

      const latestOption = await manager.getRepository(ProductOption).findOne({
        where: { id: item.selectedOption.id },
      });

      if (!latestOption || !latestOption.isActive) {
        throw new BadRequestException(
          `Selected purchase option is unavailable for ${item.product.name}.`,
        );
      }

      if (latestOption.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `${item.product.name} does not have enough stock for the selected pack size.`,
        );
      }

      latestOption.stockQuantity -= item.quantity;
      await manager.getRepository(ProductOption).save(latestOption);
    }

    for (const [productId, quantity] of productAdjustments.entries()) {
      const product = await manager.getRepository(Product).findOne({
        where: { id: productId },
        relations: {
          options: true,
        },
      });

      if (!product) {
        throw new BadRequestException(
          'One or more selected products are unavailable.',
        );
      }

      const hasActiveOptions = (product.options ?? []).some(
        (option) => option.isActive,
      );

      if (hasActiveOptions) {
        product.stockQuantity = (product.options ?? [])
          .filter((option) => option.isActive)
          .reduce((sum, option) => sum + option.stockQuantity, 0);
      } else {
        if (product.stockQuantity < quantity) {
          throw new BadRequestException(
            `${product.name} is no longer available in the requested quantity.`,
          );
        }

        product.stockQuantity -= quantity;
      }

      await manager.getRepository(Product).save(product);
    }
  }
}
