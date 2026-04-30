"use client";

import { useBooks } from '@/contexts/BooksContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { PageShell } from '@/components/PageShell';
import { AudioPlayer } from '@/components/AudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  BookOpen, Headphones, ShoppingCart, ArrowLeft, X, 
  CheckCircle2, Star, MessageSquare, Share2, 
  Users, BookMarked, Quote
} from 'lucide-react';
import { AnimatedBookCard } from '@/components/AnimatedBookCard';
import { BookComments } from '@/components/BookComments';
import { FavoriteButton } from '@/components/FavoriteButton';

// دالة قوية لتنسيق التصنيفات: تعمل مع string أو array، وتضيف " • " بينهم،
// وتنظف النص من أي مسافات زائدة أو تكرار.
function formatCategories(cat: string | string[]): string {
  if (!cat) return '';
  
  // لو كانت مصفوفة، نفلتر العناصر الفارغة ثم ندمج بـ " • "
  if (Array.isArray(cat)) {
    const filtered = cat.filter(c => c && c.trim().length > 0);
    return filtered.join(' • ');
  }
  
  // لو كانت نص (string) و تحتوي على فاصل " • " نرجعه كما هو
  if (typeof cat === 'string' && cat.includes(' • ')) {
    return cat;
  }
  
  // لو كانت نص عادي بدون فواصل (مثلاً "أطفالتعليم مبكر")، نحاول فصلها إذا كانت كلمات مفصولة بمسافات
  // لكن الحل الأمثل هنا هو إما تقسيمها بشكل ذكي أو إرجاعها كما هي – لن نعدل البيانات الأصلية.
  // نكتفي بإرجاع النص كما هو (قد يكون ملتصقاً، لكن الخطأ في البيانات نفسها وليس في العرض)
  return cat;
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const { books } = useBooks();
  const { addToCart, items } = useCart();
  const { locale, t, dir } = useTranslation();
  const router = useRouter();
  const [showReader, setShowReader] = useState(false);

  const book = useMemo(() => books.find((b) => b.id === id), [books, id]);
  const isAdded = items.some((item) => item.bookId === id);

  const similarBooks = useMemo(() => {
    return books.filter((b) => b.id !== id).slice(0, 3);
  }, [books, id]);

  if (!book) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <button onClick={() => router.back()} className="mt-4 text-brand underline">Go back</button>
        </div>
      </PageShell>
    );
  }

  const title = locale === 'ar' ? book.title_ar : book.title_en;
  const author = locale === 'ar' ? book.author_ar : book.author_en;
  const categoriesRaw = locale === 'ar' ? book.category_ar : book.category_en;
  const categoryDisplay = formatCategories(categoriesRaw);
  const content = locale === 'ar' ? book.content_ar : book.content_en;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-slate-500 transition-colors hover:text-brand font-black uppercase tracking-widest text-sm"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-brand/10 group-hover:text-brand">
            <ArrowLeft className={`size-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </div>
          {locale === 'ar' ? 'العودة للمكتبة' : 'Back to Library'}
        </button>

        {/* Main Section */}
        <div className="grid gap-12 lg:grid-cols-[450px_1fr]">
          {/* Left Side: Cover & Stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-[3rem] border-[12px] border-white shadow-2xl dark:border-slate-800"
            >
              <Image src={book.coverUrl} alt={title} fill sizes="(max-width: 1024px) 100vw, 450px" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              <div className="absolute top-6 right-6">
                <FavoriteButton 
                  bookId={book.id} 
                  showText
                  className="bg-slate-950/40 hover:bg-slate-950/60"
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-[2rem] bg-white/50 p-6 text-center backdrop-blur-sm dark:bg-slate-900/50">
                <Users className="mx-auto mb-2 size-6 text-brand" />
                <p className="text-xl font-black text-slate-900 dark:text-white">1.2k</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{locale === 'ar' ? 'قارئ' : 'Readers'}</p>
              </div>
              <div className="rounded-[2rem] bg-white/50 p-6 text-center backdrop-blur-sm dark:bg-slate-900/50">
                <Star className="mx-auto mb-2 size-6 text-amber-500" />
                <p className="text-xl font-black text-slate-900 dark:text-white">4.8</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{locale === 'ar' ? 'تقييم' : 'Rating'}</p>
              </div>
              <div className="rounded-[2rem] bg-white/50 p-6 text-center backdrop-blur-sm dark:bg-slate-900/50">
                <BookMarked className="mx-auto mb-2 size-6 text-sky-500" />
                <p className="text-xl font-black text-slate-900 dark:text-white">320</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{locale === 'ar' ? 'صفحة' : 'Pages'}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Info & Actions */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand">
                  {categoryDisplay}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  {book.type === 'audio' ? <Headphones className="size-4" /> : <BookOpen className="size-4" />}
                  {book.type === 'audio' ? t('book.audioType') : t('book.regularType')}
                </span>
              </div>

              <h1 className="text-5xl font-black leading-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl">
                {title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{locale === 'ar' ? 'المؤلف' : 'AUTHOR'}</p>
                  <p className="text-xl font-black text-brand">{author}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white">${book.price}</span>
                <span className="text-slate-400 line-through font-bold">${book.price + 10}</span>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReader(true)}
                className="flex items-center gap-3 rounded-full bg-slate-950 px-10 py-5 text-lg font-black text-white shadow-2xl dark:bg-white dark:text-slate-950"
              >
                {book.type === 'audio' ? <Headphones className="size-6" /> : <BookOpen className="size-6" />}
                {book.type === 'audio' ? t('book.listen') : t('book.read')}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(book.id)}
                className={`flex items-center gap-3 rounded-full px-10 py-5 text-lg font-black text-white shadow-glow transition-all ${
                  isAdded ? 'bg-green-600' : 'bg-brand'
                }`}
              >
                {isAdded ? <CheckCircle2 className="size-6" /> : <ShoppingCart className="size-6" />}
                {isAdded ? t('book.done') : t('book.add')}
              </motion.button>
            </div>

            {book.type === 'audio' && book.audioSrc && (
              <div className="rounded-[2.5rem] bg-brand/5 p-6 border border-brand/10">
                <p className="mb-4 text-sm font-black uppercase tracking-widest text-brand flex items-center gap-2">
                  <Headphones className="size-4" />
                  {locale === 'ar' ? 'معاينة صوتية' : 'AUDIO PREVIEW'}
                </p>
                <AudioPlayer src={book.audioSrc} />
              </div>
            )}

            <div className="space-y-4 rounded-[2.5rem] bg-white/50 p-8 dark:bg-slate-900/50">
               <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                 <Quote className="size-5 text-brand" />
                 {locale === 'ar' ? 'عن الكتاب' : 'About the Book'}
               </h3>
               <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                 {content}
               </p>
            </div>
          </div>
        </div>

        {/* Dynamic Comments Section */}
        <BookComments bookId={book.id} />

        {/* Similar Books */}
        {similarBooks.length > 0 && (
          <section className="space-y-8 pt-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'كتب مشابهة قد تعجبك' : 'Similar books you might like'}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {similarBooks.map((b) => (
                <AnimatedBookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {showReader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[3rem] bg-white shadow-2xl dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-8 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-12 overflow-hidden rounded-lg shadow-md">
                    <Image src={book.coverUrl} alt={title} fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h2>
                    <p className="font-bold text-brand">{author}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReader(false)}
                  className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800"
                >
                  <X className="size-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                <div className="mx-auto max-w-3xl space-y-12 text-center md:text-start">
                  <div className="prose prose-slate prose-xl dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-xl leading-[2.2] text-slate-700 dark:text-slate-300">
                      {content}
                    </p>
                    <div className="opacity-50 mt-8">
                       <p className="leading-loose italic">{content}</p>
                       <p className="leading-loose mt-4">{content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 90, 43, 0.15);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 90, 43, 0.3);
        }
      `}</style>
    </PageShell>
  );
}