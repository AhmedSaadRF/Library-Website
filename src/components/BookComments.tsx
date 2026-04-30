"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { BookComment } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Avatar } from './Avatar';
import Link from 'next/link';

interface BookCommentsProps {
  bookId: string;
}

export function BookComments({ bookId }: BookCommentsProps) {
  const { user } = useAuth();
  const { t, locale } = useTranslation();

  const [comments, setComments] = useState<BookComment[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storageKey = `book-comments-${bookId}`;

  useEffect(() => {
    const saved = readStorage<BookComment[]>(storageKey, []);
    setComments(saved);
  }, [bookId, storageKey]);

  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / comments.length).toFixed(1);
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || !commentText.trim()) return;

    setIsSubmitting(true);

    const newComment: BookComment = {
      id: Date.now().toString(),
      bookId,
      userId: user.email,
      userName: user.name,
      userImage: user.profilePicture || undefined, // ✅ fix: convert null/undefined to undefined
      rating,
      comment: commentText.trim(),
      createdAt: new Date().toISOString().split('T')[0] >= '2026-05-06' ? new Date().toISOString().split('T')[0] : '2026-05-06'
    };

    const updated = [newComment, ...comments];
    writeStorage(storageKey, updated);
    setComments(updated);

    // Clear form
    setRating(0);
    setCommentText('');
    setIsSubmitting(false);
  };

  return (
    <section className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {locale === 'ar' ? 'آراء القراء والتقييمات' : 'Reader Reviews & Ratings'}
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {comments.length} {locale === 'ar' ? 'تعليق' : 'comments'}
          </p>
        </div>

        {comments.length > 0 && (
          <div className="flex items-center gap-4 rounded-[2rem] bg-amber-50 p-6 text-amber-600 dark:bg-amber-900/10">
            <div className="text-center">
              <p className="text-4xl font-black">{averageRating}</p>
              <p className="text-[10px] font-black uppercase tracking-widest">{locale === 'ar' ? 'من 5' : 'OUT OF 5'}</p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-6 ${i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-amber-200 dark:text-amber-900/30'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Comment Form */}
      <div className="rounded-[3rem] border border-brand/10 bg-white p-8 shadow-glow dark:bg-slate-900">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800">
              <AlertCircle className="size-8 text-slate-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {locale === 'ar' ? 'سجل دخولك لتتمكن من التقييم' : 'Login to leave a review'}
              </p>
              <Link
                href={`/login?redirect=/books/${bookId}`}
                className="mt-2 inline-block text-brand font-bold underline underline-offset-4 hover:text-brand-dark"
              >
                {t('auth.loginTitle')}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-wrap items-center gap-6">
              <Avatar src={user.profilePicture || undefined} name={user.name} size="lg" />
              <div className="space-y-2">
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {locale === 'ar' ? 'كيف تقيم هذا الكتاب؟' : 'How would you rate this book?'}
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className={`size-8 transition-colors ${(hoverRating || rating) >= star
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-slate-200 dark:text-slate-700'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={locale === 'ar' ? 'شاركنا رأيك حول الكتاب...' : 'Share your thoughts about the book...'}
                required
                className="min-h-32 w-full rounded-[2rem] border border-brand/15 bg-transparent p-6 text-lg outline-none ring-brand transition-all focus:ring-2 dark:text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting || rating === 0 || !commentText.trim()}
                className="absolute bottom-4 right-4 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-lg disabled:opacity-50 disabled:grayscale ltr:right-4 rtl:left-4"
              >
                <Send className={`size-6 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group flex flex-col justify-between rounded-[2.5rem] bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={comment.userImage} name={comment.userName} size="md" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-none">{comment.userName}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">{comment.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`size-3 ${i < comment.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 italic">
                  &quot;{comment.comment}&quot;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-brand/20 transition-colors group-hover:text-brand/40">
                <MessageSquare className="size-4" />
                <div className="h-px flex-1 bg-current" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
            <MessageSquare className="size-12 mb-4 opacity-20" />
            <p className="text-lg font-bold">
              {locale === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : 'No reviews yet. Be the first to review!'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}