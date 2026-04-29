"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  BookOpen, LogIn, MapPinned, ShoppingBag, 
  UserRound, X, User, Settings, LogOut, Home, Briefcase
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { ListenButton } from "./ListenButton";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, onLogout }: MobileMenuProps) {
  const pathname = usePathname();
  const { t, dir } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { items, openCart } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const links = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/books", label: t("nav.books"), icon: BookOpen },
    { href: "/buy", label: t("nav.buy"), icon: Briefcase },
    { href: "/route", label: t("nav.route"), icon: MapPinned },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-950/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: dir === "rtl" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: dir === "rtl" ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 ${
              dir === "rtl" ? "right-0" : "left-0"
            } z-[70] w-full max-w-sm border-r border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl dark:bg-slate-900/90`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <p className="text-xl font-black text-brand dark:text-brand-light">
                  {t("brandName")}
                </p>
                <button
                  onClick={onClose}
                  className="rounded-full bg-slate-100 p-2 dark:bg-slate-800"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                {links.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-4 rounded-3xl px-6 py-4 text-sm font-bold transition-all ${
                      pathname === href
                        ? "bg-brand text-white shadow-glow"
                        : "text-slate-700 hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                ))}

                <button
                  onClick={() => {
                    onClose();
                    openCart();
                  }}
                  className="flex w-full items-center justify-between rounded-3xl px-6 py-4 text-sm font-bold text-slate-700 hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="size-5" />
                    {t("nav.buy")}
                  </div>
                  {count > 0 && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] text-white">
                      {count}
                    </span>
                  )}
                </button>

                <div className="my-6 h-px bg-slate-100 dark:bg-slate-800" />

                {user ? (
                  <>
                    <div className="px-6 mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {t("misc.user")}
                      </p>
                      <p className="text-lg font-black text-slate-900 dark:text-white truncate">
                        {user.name || user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-3xl px-6 py-4 text-sm font-bold text-slate-700 hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <User className="size-5 text-brand" />
                      {dir === "rtl" ? "الملف الشخصي" : "Profile"}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-3xl px-6 py-4 text-sm font-bold text-slate-700 hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        <Settings className="size-5 text-brand" />
                        {t("nav.admin")}
                      </Link>
                    )}
                    <button
                      onClick={onLogout}
                      className="flex w-full items-center gap-4 rounded-3xl px-6 py-4 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                    >
                      <LogOut className="size-5" />
                      {t("nav.logout")}
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex items-center justify-center rounded-2xl border border-brand/20 py-4 text-sm font-bold text-brand"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      href="/register"
                      onClick={onClose}
                      className="flex items-center justify-center rounded-2xl bg-brand py-4 text-sm font-bold text-white shadow-glow"
                    >
                      {t("nav.register")}
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 flex items-center justify-center gap-6">
                <ListenButton />
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
