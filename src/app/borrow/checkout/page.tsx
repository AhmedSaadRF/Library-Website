/* eslint-disable react-hooks/purity */
"use client";

import { PageShell } from '@/components/PageShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CheckoutWizard } from '@/components/CheckoutWizard';
import { CurrencySelector } from '@/components/CurrencySelector';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/contexts/BooksContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft, Trash2, Receipt, User, Phone, CreditCard, Lock, IdCard } from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function BorrowCheckoutPage() {
  const { user } = useAuth();
  const { books } = useBooks();
  const { borrowCart, removeFromBorrowCart, confirmBorrowing, getBorrowPrice } = useBorrow();
  const { formatPrice } = useCurrency();
  const { locale, t } = useTranslation();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(7);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    nationalId: '',
    paymentMethod: 'cash' as 'cash' | 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const detailedItems = useMemo(
    () =>
      borrowCart
        .map((id) => books.find((book) => book.id === id))
        .filter((book) => book),
    [books, borrowCart]
  );

  const borrowPriceEGP = getBorrowPrice(duration) * detailedItems.length;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 2) {
      if (!formData.name) newErrors.name = locale === 'ar' ? 'الاسم مطلوب' : 'Name is required';
      if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
        newErrors.phone = locale === 'ar' ? 'رقم موبايل مصري غير صحيح' : 'Invalid Egyptian mobile number';
      }
      if (formData.nationalId && !/^[0-9]{14}$/.test(formData.nationalId)) {
        newErrors.nationalId = locale === 'ar' ? 'الرقم القومي يجب أن يكون 14 رقم' : 'National ID must be 14 digits';
      }
    }
    if (step === 3 && formData.paymentMethod === 'card') {
      if (!/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = locale === 'ar' ? 'رقم كارت غير صحيح (16 رقم)' : 'Invalid card number (16 digits)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const steps = [t('borrow.duration'), t('checkout.personalInfo'), t('wizard.step3'), t('borrow.success')];

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 4));
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const submit = () => {
    if (!user || detailedItems.length === 0) return;

    confirmBorrowing(
      user.email,
      detailedItems.map(b => ({ id: b!.id, title_ar: b!.title_ar, title_en: b!.title_en })),
      duration
    );
    setStep(4);
  };

  if (step === 4) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-24 bg-brand rounded-full flex items-center justify-center text-white shadow-glow">
            <CheckCircle2 className="size-12" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('borrow.success')}</h1>
          <button onClick={() => router.push('/profile?tab=borrowings')} className="bg-brand text-white px-10 py-4 rounded-full font-black text-lg shadow-glow hover:scale-105 transition-all">
            {t('borrow.myBorrowings')}
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ProtectedRoute redirectTo="/borrow/checkout">
        <div className="max-w-5xl mx-auto py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">{t('borrow.title')}</h1>
              <p className="text-slate-500 font-bold">{locale === 'ar' ? 'أكمل بيانات الاستعارة برؤية احترافية' : 'Complete borrowing details professionally'}</p>
            </div>
            <CurrencySelector compact />
          </div>

          <CheckoutWizard currentStep={step} steps={steps}>
            {step === 1 && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-brand/10 shadow-glow flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-brand/10 rounded-2xl text-brand"><BookOpen className="size-6" /></div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('borrow.cart.title')}</h2>
                    </div>
                    <div className="space-y-4 flex-1 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                      {detailedItems.map((book) => (
                        <div key={book?.id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                          <div className="relative size-16 rounded-2xl overflow-hidden flex-shrink-0">
                            <Image src={book?.coverUrl || ''} alt="" fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{locale === 'ar' ? book?.title_ar : book?.title_en}</p>
                          </div>
                          <button onClick={() => removeFromBorrowCart(book!.id)} className="text-rose-500 p-2"><Trash2 size={18}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-brand/10 shadow-glow">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-brand/10 rounded-2xl text-brand"><Calendar className="size-6" /></div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('borrow.duration')}</h2>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[7, 14, 30].map(d => (
                          <button key={d} onClick={() => setDuration(d)} className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center ${duration === d ? 'border-brand bg-brand/5' : 'border-slate-100 dark:border-white/5'}`}>
                            <p className="text-2xl font-black text-brand">{d}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('borrow.days')}</p>
                            <p className="mt-2 text-xs font-black text-slate-600 dark:text-slate-400">{formatPrice(getBorrowPrice(d))}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-brand text-white rounded-[3rem] p-8 shadow-glow relative overflow-hidden">
                      <Receipt className="absolute -right-4 -bottom-4 size-32 opacity-10" />
                      <div className="relative z-10">
                        <p className="text-sm font-black uppercase tracking-widest opacity-80">{t('borrow.totalCost')}</p>
                        <p className="text-4xl font-black mt-2">{formatPrice(borrowPriceEGP)}</p>
                        <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center text-sm font-bold">
                          <span>{t('borrow.dueDate')}</span>
                          <span>{new Date(Date.now() + duration * 86400000).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button disabled={detailedItems.length === 0} onClick={handleNext} className="group flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-black text-lg shadow-glow hover:scale-105 transition-all disabled:opacity-50">
                    {t('wizard.next')}
                    <ChevronRight className={`size-6 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-brand/10 shadow-glow">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand/10 rounded-2xl text-brand"><User className="size-6" /></div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('checkout.personalInfo')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><User size={14}/> {t('checkout.name')}</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-slate-50 dark:bg-white/5 border ${errors.name ? 'border-rose-500' : 'border-slate-100 dark:border-white/5'} rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold`} />
                      {errors.name && <p className="text-rose-500 text-[10px] font-bold px-4">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><Phone size={14}/> {t('checkout.phone')}</label>
                      <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full bg-slate-50 dark:bg-white/5 border ${errors.phone ? 'border-rose-500' : 'border-slate-100 dark:border-white/5'} rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold`} placeholder="01234567890" />
                      {errors.phone && <p className="text-rose-500 text-[10px] font-bold px-4">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><IdCard size={14}/> {t('checkout.nationalId')}</label>
                      <input value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} className={`w-full bg-slate-50 dark:bg-white/5 border ${errors.nationalId ? 'border-rose-500' : 'border-slate-100 dark:border-white/5'} rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold`} placeholder={t('checkout.nationalIdPlaceholder')} />
                      {errors.nationalId && <p className="text-rose-500 text-[10px] font-bold px-4">{errors.nationalId}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={handlePrev} className="flex items-center gap-2 text-slate-500 font-black hover:text-brand transition-colors"><ChevronLeft className={locale === 'ar' ? 'rotate-180' : ''} /> {t('wizard.prev')}</button>
                  <button onClick={handleNext} disabled={!formData.name || !formData.phone} className="group flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-black text-lg shadow-glow hover:scale-105 transition-all disabled:opacity-50">
                    {t('wizard.next')}
                    <ChevronRight className={`size-6 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-brand/10 shadow-glow">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand/10 rounded-2xl text-brand"><ShieldCheck className="size-6" /></div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('wizard.step3')}</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300 font-bold">
                      <p className="mb-4 text-xl font-black text-slate-900 dark:text-white">{t('checkout.transactionDetails')}</p>
                      <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
                        <span>{t('checkout.bookCount')}</span>
                        <span>{detailedItems.length}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
                        <span>{t('checkout.totalPrice')}</span>
                        <span className="text-brand font-black">{formatPrice(borrowPriceEGP)}</span>
                      </div>
                      <p className="mt-6 mb-4 text-brand font-black">{t('borrow.termsTitle')}</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm opacity-80 font-semibold">
                        <li>{t('borrow.terms1')}</li>
                        <li>{t('borrow.terms2')}</li>
                        <li>{t('borrow.terms3')}</li>
                      </ul>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <button onClick={() => setFormData({...formData, paymentMethod: 'cash'})} className={`p-6 rounded-[2rem] border-2 text-left transition-all ${formData.paymentMethod === 'cash' ? 'border-brand bg-brand/5' : 'border-slate-100 dark:border-white/5'}`}>
                        <p className="font-black text-lg mb-1">{locale === 'ar' ? 'دفع عند الاستلام' : 'Cash on Pickup'}</p>
                        <p className="text-xs text-slate-500 font-bold">{t('checkout.simulation')}</p>
                      </button>
                      <button onClick={() => setFormData({...formData, paymentMethod: 'card'})} className={`p-6 rounded-[2rem] border-2 text-left transition-all ${formData.paymentMethod === 'card' ? 'border-brand bg-brand/5' : 'border-slate-100 dark:border-white/5'}`}>
                        <p className="font-black text-lg mb-1">{locale === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</p>
                        <p className="text-xs text-slate-500 font-bold">{t('checkout.simulation')}</p>
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {formData.paymentMethod === 'card' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">{t('checkout.cardNumber')}</label>
                            <input value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-mono" placeholder="0000 0000 0000 0000" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input value={formData.cardExpiry} onChange={e => setFormData({...formData, cardExpiry: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold" placeholder={t('checkout.cardExpiry')} />
                            <input value={formData.cardCvv} onChange={e => setFormData({...formData, cardCvv: e.target.value})} type="password" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold" placeholder={t('checkout.cardCvv')} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <label className="flex items-center gap-4 cursor-pointer group p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="size-6 rounded-lg border-2 border-brand accent-brand" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('borrow.terms')}</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={handlePrev} className="flex items-center gap-2 text-slate-500 font-black hover:text-brand transition-colors"><ChevronLeft className={locale === 'ar' ? 'rotate-180' : ''} /> {t('wizard.prev')}</button>
                  <button disabled={!agreed || (formData.paymentMethod === 'card' && !formData.cardNumber)} onClick={submit} className="group flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-black text-lg shadow-glow hover:scale-105 transition-all disabled:opacity-50">
                    {t('checkout.confirmAndPay')}
                    <CheckCircle2 className="size-6 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </CheckoutWizard>
        </div>
      </ProtectedRoute>
    </PageShell>
  );
}
