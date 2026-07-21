import React, { useState } from "react";
import { IconCopy, IconCheck } from "./icons";

interface CopyButtonProps {
  value: string;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label ? `نسخ ${label}` : "نسخ"}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#d9c79f] bg-white/70 px-3 py-1.5 text-xs font-medium text-[#7a6238] transition hover:bg-[#f4ecd8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d4f] focus-visible:ring-offset-2"
    >
      {copied ? (
        <>
          <IconCheck className="h-3.5 w-3.5" />
          تم النسخ
        </>
      ) : (
        <>
          <IconCopy className="h-3.5 w-3.5" />
          نسخ
        </>
      )}
    </button>
  );
};