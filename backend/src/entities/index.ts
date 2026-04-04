import { Admin } from './admin.entity';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { ProductImage } from './product-image.entity';
import { Product } from './product.entity';
import { Review } from './review.entity';
import { SiteSetting } from './site-setting.entity';

export { Admin } from './admin.entity';
export { Category } from './category.entity';
export { Order } from './order.entity';
export { OrderItem } from './order-item.entity';
export { Product } from './product.entity';
export { ProductImage } from './product-image.entity';
export { Review } from './review.entity';
export { SiteSetting } from './site-setting.entity';

export const DATABASE_ENTITIES = [
  Admin,
  Category,
  Product,
  ProductImage,
  Order,
  OrderItem,
  Review,
  SiteSetting,
];
