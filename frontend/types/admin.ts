import { Category, Order, ProductSummary, Review, SiteSetting } from "@/types/api";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: AdminProfile;
}

export interface AdminSession {
  admin: AdminProfile;
}

export type AdminProduct = ProductSummary;
export type AdminCategory = Category;
export type AdminOrder = Order;
export type AdminReview = Review;
export type AdminSetting = SiteSetting;

export interface AdminDashboardSummary {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  latestOrders: AdminOrder[];
}
