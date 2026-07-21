import type { Product } from "../types/product";

export const products: Record<string, Product> = {
  "kouni-hajar": {
    id: "kouni-hajar",
    slug: "kouni-hajar",
    title: "كوني هاجر",
    subtitle: "دروس من سيرة هاجر عليها السلام",
    coverImage: "/covers/kouni-hajar.jpg",
    oldPrice: 25,
    newPrice: 15,
    currency: "USD",
    language: "العربية",
    pages: 96,
    format: "PDF رقمي",
    deliveryNotice: "يصلك رابط التحميل عبر البريد الإلكتروني فور تأكيد الدفع",
  },
};

export const getProductBySlug = (slug: string): Product | undefined =>
  products[slug];

export const defaultProduct: Product = products["kouni-hajar"];