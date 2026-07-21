import React from "react";
import { motion } from "framer-motion";

interface CheckoutHeroProps {
  title: string;
}

export const CheckoutHero: React.FC<CheckoutHeroProps> = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d9c79f] bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-[#8a6d3b]">
        كتاب رقمي · تسليم فوري
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#2c2416] sm:text-4xl">
        إتمام عملية الشراء
      </h1>
      <p className="mt-3 text-sm text-[#7a6a52] sm:text-base">{title}</p>
    </motion.div>
  );
};