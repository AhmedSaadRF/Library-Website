"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

interface NavDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function NavDropdown({ trigger, children, align = "right" }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { dir } = useTranslation();

  // Adjust alignment based on direction
  const isRTL = dir === "rtl";
  const effectiveAlign = isRTL ? (align === "right" ? "left" : "right") : align;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="cursor-pointer">{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-2 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80 ${
              effectiveAlign === "right" ? "right-0" : "left-0"
            }`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
