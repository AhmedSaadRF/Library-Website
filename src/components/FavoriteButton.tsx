"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  bookId: string;
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({ bookId, className = '', showText = false }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useTranslation();
  const router = useRouter();
  const active = isFavorite(bookId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }
    
    toggleFavorite(bookId);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`relative flex items-center gap-2 rounded-full transition-colors ${
        showText 
          ? 'bg-white/10 px-6 py-3 backdrop-blur-md hover:bg-white/20' 
          : 'p-2'
      } ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active ? 'active' : 'inactive'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 1.4 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Heart 
            className={`size-6 ${active ? 'fill-rose-500 text-rose-500' : 'text-current'}`} 
          />
        </motion.div>
      </AnimatePresence>
      
      {showText && (
        <span className="text-sm font-black uppercase tracking-widest text-white">
          {active ? t('favorites.remove') : t('favorites.add')}
        </span>
      )}
    </motion.button>
  );
}
