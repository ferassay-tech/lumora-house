import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { Product } from "../types/product";
import type { PaymentMethodId } from "../config/paymentMethods";
import { defaultProduct } from "../data/products";

interface ConfirmationData {
  fullName: string;
  email: string;
  country: string;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
  receiptFileName?: string;
}

interface CheckoutContextValue {
  product: Product;
  setProduct: (product: Product) => void;
  selectedMethodId: PaymentMethodId | null;
  setSelectedMethodId: (id: PaymentMethodId) => void;
  confirmation: ConfirmationData | null;
  setConfirmation: (data: ConfirmationData) => void;
}

const STORAGE_KEY = "lumora_checkout_state_v1";

const CheckoutContext = createContext<CheckoutContextValue | undefined>(
  undefined
);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [product, setProduct] = useState<Product>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.product) return parsed.product;
      }
    } catch {
      /* ignore malformed storage */
    }
    return defaultProduct;
  });

  const [selectedMethodId, setSelectedMethodId] =
    useState<PaymentMethodId | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(
    null
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ product, selectedMethodId, confirmation })
      );
    } catch {
      /* ignore quota errors */
    }
  }, [product, selectedMethodId, confirmation]);

  return (
    <CheckoutContext.Provider
      value={{
        product,
        setProduct,
        selectedMethodId,
        setSelectedMethodId,
        confirmation,
        setConfirmation,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextValue => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return ctx;
};