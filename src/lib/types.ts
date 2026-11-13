export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  shortDescription?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  basePrice: number;
  salePrice?: number | null;
  discountPercent: number;
  sku: string;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  packSize: string;
  shelfLife: string;
  temperature: string;
  ingredients?: string | null;
  nutritionalInfo?: string | null;
  reviews?: any[];
  images: {
    id: string;
    url: string;
    alt?: string | null;
    isPrimary: boolean;
  }[];
  variants?: {
    id: string;
    packSize: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    flavour?: {
      id: string;
      name: string;
      color: string;
    } | null;
  }[];
}

export interface FlavourItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string | null;
  icon?: string | null;
  isPopular: boolean;
}

export interface CartItemType {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  flavour: string;
  packSize: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pinCode: string;
  orderNotes?: string | null;
  subtotal: number;
  taxAmount: number;
  deliveryCharge: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  estimatedDelivery?: string | null;
  cancelledReason?: string | null;
  createdAt: string | Date;
  items: {
    id: string;
    productName: string;
    productSlug?: string | null;
    productImage?: string | null;
    flavour?: string | null;
    packSize?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface CouponType {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  isActive: boolean;
}
