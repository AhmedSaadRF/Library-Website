"use client";

import { PageShell } from '@/components/PageShell';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t, locale } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError(locale === 'ar' ? 'حجم الصورة كبير جداً (الأقصى 2 ميجابايت)' : 'Image size is too large (max 2MB)');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = register(name, email, password, image || undefined);
      if (!result.success) {
        setError(result.message || 'Error');
        setIsSubmitting(false);
        return;
      }
      router.push(redirect);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-xl">
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-[3rem] border border-brand/10 bg-white p-10 shadow-glow dark:bg-slate-900"
        >
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
              {t('auth.registerTitle')}
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {locale === 'ar' ? 'انضم إلى مجتمعنا القرائي اليوم' : 'Join our reading community today'}
            </p>
          </div>

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex size-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-brand/20 bg-slate-50 transition-all hover:border-brand/50 dark:bg-slate-800 ${image ? '' : 'border-dashed'}`}
              >
                {image ? (
                  <Image src={image} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <Camera className="size-8" />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                      {locale === 'ar' ? 'صورة شخصية' : 'Photo'}
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center bg-brand/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="size-6 text-white" />
                </div>
              </motion.div>
              
              {image && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                  }}
                  className="absolute -top-1 -right-1 flex size-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
                {t('auth.name')}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full rounded-[1.5rem] border border-brand/15 bg-transparent px-6 py-4 outline-none ring-brand transition-all focus:ring-2 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
                {t('auth.email')}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email@example.com"
                required
                className="w-full rounded-[1.5rem] border border-brand/15 bg-transparent px-6 py-4 outline-none ring-brand transition-all focus:ring-2 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
                {t('auth.password')}
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-[1.5rem] border border-brand/15 bg-transparent px-6 py-4 outline-none ring-brand transition-all focus:ring-2 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm font-bold text-rose-600"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand py-5 text-lg font-black text-white shadow-glow transition-all hover:bg-brand-dark disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                {locale === 'ar' ? 'جاري التسجيل...' : 'Registering...'}
              </div>
            ) : (
              t('auth.submitRegister')
            )}
          </motion.button>

          <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400">
            {locale === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
            <Link
              href={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-brand underline underline-offset-4"
            >
              {t('auth.loginTitle')}
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
