export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  oldPrice: number;
  newPrice: number;
  currency: string;
  language: string;
  pages: number;
  format: string;
  deliveryNotice: string;
}