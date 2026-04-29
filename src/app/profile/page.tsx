"use client";

import { PageShell } from '@/components/PageShell';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Avatar } from '@/components/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, LogOut, Calendar, Mail, Shield, 
  MessageSquare, Star, ArrowRight, Camera, Save, X
} from 'lucide-react';
import { readStorage } from '@/utils/localStorageUtils';
import { BookComment, Book } from '@/types';
import Link from 'next/link';
import { useBooks } from '@/contexts/BooksContext';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { books } = useBooks();
  const { t, locale } = useTranslation();
  const router = useRouter();
  
  const [userComments, setUserComments] = useState<BookComment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }
    
    setEditName(user.name);
    setEditImage(user.profilePicture || null);

    // Collect all comments from all books for this user
    const allComments: BookComment[] = [];
    books.forEach(book => {
      const bookComments = readStorage<BookComment[]>(`book-comments-${book.id}`, []);
      const userBookComments = bookComments.filter(c => c.userId === user.email);
      allComments.push(...userBookComments);
    });
    
    setUserComments(allComments.sort((a, b) => b.id.localeCompare(a.id)));
  }, [user, router, books]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const result = updateProfile(editName, editImage || undefined);
    if (result.success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[3.5rem] border border-brand/10 bg-white p-8 shadow-glow dark:bg-slate-900 md:p-12"
        >
          {/* Background Decorative Element */}
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-brand/5 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 size-64 rounded-full bg-sky-500/5 blur-3xl" />

          <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar 
                src={isEditing ? (editImage || undefined) : user.profilePicture} 
                name={user.name} 
                size="xl" 
                className="ring-4 ring-brand/10"
              />
              
              <AnimatePresence>
                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/40 text-white backdrop-blur-sm transition-colors hover:bg-slate-950/60"
                  >
                    <Camera className="size-8" />
                  </motion.button>
                )}
              </AnimatePresence>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center md:text-start">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-start">
                <div className="space-y-2">
                  {isEditing ? (
                    <input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-4xl font-black text-slate-900 bg-slate-50 border-b-2 border-brand px-2 outline-none dark:bg-slate-800 dark:text-white"
                      autoFocus
                    />
                  ) : (
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white">
                      {user.name}
                    </h1>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 md:justify-start">
                    <span className="flex items-center gap-1.5 text-sm font-bold">
                      <Mail className="size-4 text-brand" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold">
                      <Calendar className="size-4 text-sky-500" />
                      {locale === 'ar' ? 'انضم في ' : 'Joined '} {user.registeredAt}
                    </span>
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${
                      user.role === 'admin' ? 'bg-rose-100 text-rose-600' : 'bg-brand/10 text-brand'
                    }`}>
                      <Shield className="size-3" />
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white shadow-lg"
                      >
                        <Save className="size-5" />
                        {locale === 'ar' ? 'حفظ' : 'Save'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(user.name);
                          setEditImage(user.profilePicture || null);
                        }}
                        className="flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <X className="size-5" />
                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-slate-900 shadow-sm border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      >
                        <Settings className="size-5 text-brand" />
                        {locale === 'ar' ? 'تعديل البروفايل' : 'Edit Profile'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          logout();
                          router.push('/');
                        }}
                        className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition-colors hover:bg-rose-500 hover:text-white dark:bg-rose-900/20"
                      >
                        <LogOut className="size-6" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Stats Bar */}
          <div className="space-y-6">
             <div className="rounded-[2.5rem] bg-white p-8 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                 {locale === 'ar' ? 'نشاطك' : 'Your Activity'}
               </h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-brand/5">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="size-5 text-brand" />
                      <span className="font-bold text-slate-600 dark:text-slate-300">{locale === 'ar' ? 'التعليقات' : 'Comments'}</span>
                    </div>
                    <span className="text-2xl font-black text-brand">{userComments.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10">
                    <div className="flex items-center gap-3">
                      <Star className="size-5 text-amber-500" />
                      <span className="font-bold text-slate-600 dark:text-slate-300">{locale === 'ar' ? 'التقييمات' : 'Ratings'}</span>
                    </div>
                    <span className="text-2xl font-black text-amber-600">{userComments.length}</span>
                  </div>
               </div>
             </div>
          </div>

          {/* Comments Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white px-4">
              {locale === 'ar' ? 'تعليقاتك الأخيرة' : 'Your Recent Comments'}
            </h2>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {userComments.map((comment) => {
                  const book = books.find(b => b.id === comment.bookId);
                  if (!book) return null;
                  
                  return (
                    <motion.div
                      key={comment.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex flex-col gap-4 rounded-[2.5rem] bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-all hover:border-brand/20"
                    >
                      <div className="flex items-center justify-between">
                        <Link href={`/books/${book.id}`} className="flex items-center gap-4 group/book">
                          <div className="relative size-12 overflow-hidden rounded-lg">
                            <img src={book.coverUrl} alt={book.title_en} className="object-cover" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white group-hover/book:text-brand transition-colors">
                              {locale === 'ar' ? book.title_ar : book.title_en}
                            </p>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`size-2.5 ${i < comment.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                        </Link>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{comment.createdAt}</span>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                        "{comment.comment}"
                      </p>
                      
                      <Link 
                        href={`/books/${book.id}`}
                        className="flex items-center gap-2 text-xs font-black text-brand uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {locale === 'ar' ? 'عرض الكتاب' : 'View Book'}
                        <ArrowRight className={`size-3 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {userComments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
                  <MessageSquare className="size-16 mb-4 opacity-10" />
                  <p className="text-xl font-bold">{locale === 'ar' ? 'لم تقم بإضافة أي تعليقات بعد' : 'No comments yet'}</p>
                  <Link href="/books" className="mt-4 text-brand font-bold underline underline-offset-4">{locale === 'ar' ? 'تصفح الكتب' : 'Browse Books'}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
