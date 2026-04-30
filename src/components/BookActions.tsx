"use client";

import { useCart } from '@/contexts/CartContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { ShoppingCart, BookOpenCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface BookActionsProps {
  bookId: string;
}

export function BookActions({ bookId }: BookActionsProps) {
  const { addToCart } = useCart();
  const { addToBorrowCart, borrowCart } = useBorrow();
  const { t } = useTranslation();
  const router = useRouter();

  const isBorrowed = borrowCart.includes(bookId);

  const handleBorrow = () => {
    addToBorrowCart(bookId);
    router.push('/borrow/checkout');
  };

  const handleBuy = () => {
    addToCart(bookId);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBuy}
        className="flex-1 flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-2xl font-bold shadow-glow hover:bg-brand/90 transition-colors group overflow-hidden relative"
      >
        <motion.div
          whileHover={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <ShoppingCart className="size-5" />
        </motion.div>
        {t('book.add')}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBorrow}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white py-3 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors group overflow-hidden relative"
      >
        <motion.div
          whileHover={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <BookOpenCheck className="size-5" />
        </motion.div>
        {t('book.borrow')}
      </motion.button>
    </div>
  );
}
