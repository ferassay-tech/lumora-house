import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconSuccess } from "../components/checkout/icons";

const OrderSuccessPage: React.FC = () => {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#faf6ef] px-4 py-16 text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <IconSuccess className="h-24 w-24" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="max-w-md"
      >
        <h1 className="text-2xl font-semibold text-[#2c2416]">
          شكرًا لك على شراءك
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#7a6a52]">
          تم استلام طلب الدفع الخاص بك بنجاح. سنقوم بمراجعة الدفع وإرسال رابط
          التحميل إلى بريدك الإلكتروني في أقرب وقت ممكن.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Link
          to="/"
          className="rounded-full bg-[#2c2416] px-6 py-2.5 text-sm font-medium text-[#f4ecd8] transition hover:bg-[#40331f]"
        >
          العودة للصفحة الرئيسية
        </Link>
        <Link
          to="/checkout"
          className="rounded-full border border-[#b08d4f] px-6 py-2.5 text-sm font-medium text-[#8a6d3b] transition hover:bg-[#f4ecd8]"
        >
          متابعة التسوق
        </Link>
      </motion.div>
    </main>
  );
};

export default OrderSuccessPage;