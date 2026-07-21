import React from "react";
import { motion } from "framer-motion";
import type { PaymentMethodConfig } from "../../config/paymentMethods";
import { iconMap as icons } from "./icons";

interface PaymentMethodCardProps {
  method: PaymentMethodConfig;
  onSelect: (id: PaymentMethodConfig["id"]) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  onSelect,
}) => {
  const Icon = icons[method.iconKey];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e8ddc8] bg-white/70 p-5 shadow-[0_6px_24px_rgba(60,45,20,0.06)] backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4ecd8] text-[#8a6d3b]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-[#2c2416]">
            {method.title}
          </h3>
          <p className="text-xs text-[#7a6a52]">{method.shortDescription}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(method.id)}
        aria-label={`متابعة الدفع عبر ${method.title}`}
        className="w-full rounded-full bg-[#2c2416] py-2.5 text-sm font-medium text-[#f4ecd8] transition hover:bg-[#40331f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d4f] focus-visible:ring-offset-2"
      >
        متابعة
      </button>
    </motion.div>
  );
};