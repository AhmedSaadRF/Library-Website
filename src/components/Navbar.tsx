"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { 
  BookOpen, LogIn, MapPinned, Menu, ShoppingBag, 
  UserRound, Settings, LogOut, User, ChevronDown, 
  Globe, Moon, Sun, Briefcase, Home, Bookmark, Heart
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavDropdown } from './NavDropdown';
import { MobileMenu } from './MobileMenu';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { CartDrawer } from './CartDrawer';
import { Avatar } from './Avatar';
import { useFavorites } from '@/contexts/FavoritesContext';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, dir, locale } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const { favoritesCount } = useFavorites();
  const { items, openCart } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // تحديد الصورة الرمزية: للأدمن شعار الموقع، وللمستخدم العادي صورته الشخصية أو الصورة الافتراضية
  const avatarSrc = user?.role === 'admin' 
    ? '/images/logo.png' 
    : (user?.profilePicture || '/images/default-avatar.png');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/books', label: t('nav.books'), icon: BookOpen },
    { href: '/buy', label: t('nav.buy'), icon: Briefcase },
    { href: '/route', label: t('nav.route'), icon: MapPinned }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${scrolled
            ? 'py-3 border-b border-white/10 bg-white/60 shadow-glow backdrop-blur-2xl dark:bg-slate-950/60'
            : 'py-5 bg-transparent'
          }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Logo */}
          <div className="flex-1 lg:flex-none">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Image 
                  src="/images/logo.png" 
                  alt={t('brandName')} 
                  width={48} 
                  height={48} 
                  className="h-10 w-10 sm:h-12 sm:w-12" 
                  priority 
                />
              </motion.div>
              <div className="hidden sm:block">
                <p className="text-base font-black text-brand dark:text-brand-light leading-none group-hover:text-brand-dark transition-colors">
                  {t('brandName')}
                </p>
                <p className="mt-1 text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                  {t('brandSlogan')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 rounded-full bg-white/40 p-1 border border-white/20 dark:bg-slate-900/40 backdrop-blur-md">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative rounded-full px-6 py-2 text-sm font-bold transition-all"
                >
                  <span className={`relative z-10 transition-colors ${active ? 'text-white' : 'text-slate-700 hover:text-brand dark:text-slate-200 dark:hover:text-brand-light'}`}>
                    {label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-brand shadow-lg"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4 lg:flex-none">
            
            {/* Favorites Icon */}
            <Link href="/favorites">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative rounded-full p-2.5 text-slate-700 transition-colors hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
              >
                <Heart className="size-6" />
                <AnimatePresence>
                  {favoritesCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white"
                    >
                      {favoritesCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Cart Icon */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative rounded-full p-2.5 text-slate-700 transition-colors hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <ShoppingBag className="size-6" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Desktop Only Actions */}
            <div className="hidden lg:flex items-center gap-2">
              
              {/* User Dropdown */}
              <NavDropdown
                trigger={
                  <div className="cursor-pointer rounded-full p-1 transition-transform hover:scale-105 active:scale-95">
                    {user ? (
                      <Avatar src={avatarSrc} name={user.name} size="md" />
                    ) : (
                      <div className="rounded-full p-2 text-slate-700 hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5">
                        <UserRound className="size-6" />
                      </div>
                    )}
                  </div>
                }
              >
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                      <Avatar src={avatarSrc} name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <User className="size-4 text-brand" />
                      {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                    </Link>
                    <Link
                      href="/profile?tab=borrowings"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <Bookmark className="size-4 text-brand" />
                      {t('borrow.myBorrowings')}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        <Settings className="size-4 text-brand" />
                        {t('nav.admin')}
                      </Link>
                    )}
                    <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                    >
                      <LogOut className="size-4" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <LogIn className="size-4 text-brand" />
                      {t('nav.login')}
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand/5"
                    >
                      <UserRound className="size-4" />
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </NavDropdown>

              {/* Settings Dropdown */}
              <NavDropdown
                trigger={
                  <div className="rounded-full p-2.5 text-slate-700 transition-colors hover:bg-brand/5 dark:text-slate-200 dark:hover:bg-white/5">
                    <Settings className="size-6" />
                  </div>
                }
              >
                <div className="p-1 space-y-1">
                  <div className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand/5 dark:hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <Globe className="size-4 text-brand" />
                      {locale === 'ar' ? 'English' : 'العربية'}
                    </div>
                    <LanguageToggle />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand/5 dark:hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <Sun className="size-4 text-brand dark:hidden" />
                      <Moon className="size-4 text-brand hidden dark:block" />
                      {t('theme.light')}
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </NavDropdown>
            </div>

            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-full p-2 text-slate-700 hover:bg-brand/5 dark:text-slate-200 lg:hidden"
            >
              <Menu className="size-7" />
            </button>

          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        onLogout={() => {
          setMobileOpen(false);
          setShowLogoutModal(true);
        }}
      />

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-[3rem] bg-white p-10 text-center shadow-2xl dark:bg-slate-900"
            >
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/20">
                <LogOut className="size-10" />
              </div>
              <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'تسجيل الخروج؟' : 'Logout?'}
              </h2>
              <p className="mb-8 text-slate-500 dark:text-slate-400 font-medium">
                {locale === 'ar' ? 'هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟' : 'Are you sure you want to log out of your account?'}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-full bg-slate-100 py-4 font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowLogoutModal(false);
                    router.push('/');
                  }}
                  className="flex-1 rounded-full bg-rose-600 py-4 font-bold text-white shadow-glow transition-transform hover:scale-105 active:scale-95"
                >
                  {t('nav.logout')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}