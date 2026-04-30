"use client";

import { PageShell } from '@/components/PageShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CheckoutWizard } from '@/components/CheckoutWizard';
import { CurrencySelector } from '@/components/CurrencySelector';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/contexts/BooksContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Order } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { v4 as uuid } from 'uuid';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Phone, User, Calendar, Lock } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { books } = useBooks();
  const { items, clearCart } = useCart();
  const { locale, t } = useTranslation();
  const { currency, rates } = useCurrency() as any;
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    city: 'Alexandria',
    postalCode: '',
    address: 'Alexandria, Egypt',
    paymentMethod: 'cash' as 'cash' | 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const detailedItems = useMemo(
    () =>
      items
        .map((item) => ({ ...item, book: books.find((book) => book.id === item.bookId) }))
        .filter((item) => item.book),
    [books, items]
  );
  
  const totalEGP = detailedItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
  const rate = rates[currency] || 1;
  const convertedTotalRaw = totalEGP * rate;
  const convertedTotal = Math.ceil(convertedTotalRaw * 4) / 4;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 2) {
      if (!formData.name) newErrors.name = locale === 'ar' ? 'الاسم مطلوب' : 'Name is required';
      if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
        newErrors.phone = locale === 'ar' ? 'رقم موبايل مصري غير صحيح' : 'Invalid Egyptian mobile number';
      }
      if (!formData.address) newErrors.address = locale === 'ar' ? 'العنوان مطلوب' : 'Address is required';
    }
    if (step === 3 && formData.paymentMethod === 'card') {
      if (!/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = locale === 'ar' ? 'رقم كارت غير صحيح (16 رقم)' : 'Invalid card number (16 digits)';
      }
      if (!/^[0-9]{2}\/[0-9]{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = locale === 'ar' ? 'تاريخ غير صحيح (MM/YY)' : 'Invalid expiry (MM/YY)';
      }
      if (!/^[0-9]{3}$/.test(formData.cardCvv)) {
        newErrors.cardCvv = locale === 'ar' ? 'رمز غير صحيح (3 أرقام)' : 'Invalid CVV (3 digits)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const steps = [t('wizard.step1'), t('checkout.address'), t('checkout.payment'), t('checkout.success')];

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 4));
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const submit = () => {
    if (!user) return;

    const order: Order = {
      id: uuid(),
      userEmail: user.email,
      items: items.map((item) => ({ bookId: item.bookId, quantity: item.quantity })),
      total: convertedTotal,
      currency,
      createdAt: new Date().toISOString(),
      customerName: formData.name,
      address: formData.address
    };

    const existing = readStorage<Order[]>('mobile-library-orders', []);
    writeStorage('mobile-library-orders', [order, ...existing]);
    setConfirmedOrder(order);
    clearCart();
    setStep(4);
  };

  if (step === 4 && confirmedOrder) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-24 bg-brand rounded-full flex items-center justify-center text-white shadow-glow">
            <CheckCircle2 className="size-12" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('checkout.success')}</h1>
          <p className="text-xl text-slate-500 font-bold uppercase tracking-widest">#{confirmedOrder.id.slice(0, 8).toUpperCase()}</p>
          <div className="bg-brand/5 dark:bg-white/5 p-8 rounded-[3rem] w-full max-w-md border border-brand/10">
            <p className="text-slate-600 dark:text-slate-300 mb-4">{t('checkout.name')}: <span className="font-bold text-slate-900 dark:text-white">{confirmedOrder.customerName}</span></p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{t('cart.total')}: <span className="font-black text-brand text-2xl">{formatPrice(totalEGP)}</span></p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ProtectedRoute redirectTo="/checkout">
        <div className="max-w-5xl mx-auto py-12">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">{t('checkout.title')}</h1>
          </div>

          <CheckoutWizard currentStep={step} steps={steps}>
            {/* Step 1: Summary */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-brand/10 shadow-glow">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand/10 rounded-2xl text-brand"><ShoppingBag className="size-6" /></div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('cart.title')}</h2>
                    </div>
                    <CurrencySelector compact />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {detailedItems.map((item) => (
                      <div key={item.bookId} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="relative size-20 rounded-2xl overflow-hidden flex-shrink-0">
                          <Image src={item.book?.coverUrl || ''} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{locale === 'ar' ? item.book?.title_ar : item.book?.title_en}</p>
                          <p className="text-brand font-black text-sm">{formatPrice(item.book?.price || 0)} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between items-end">
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">{t('cart.total')}</p>
                      <p className="text-4xl font-black text-brand">{formatPrice(totalEGP)}</p>
                    </div>
                    <button onClick={handleNext} className="group flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-black text-lg shadow-glow hover:scale-105 transition-all">
                      {t('wizard.next')}
                      <ChevronRight className={`size-6 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-brand/10 shadow-glow">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand/10 rounded-2xl text-brand"><MapPin className="size-6" /></div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('checkout.address')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><User size={14}/> {t('checkout.name')}</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-slate-50 dark:bg-white/5 border ${errors.name ? 'border-rose-500' : 'border-slate-100 dark:border-white/5'} rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold`} placeholder="Ahmed Saad" />
                      {errors.name && <p className="text-rose-500 text-[10px] font-bold px-4">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><Phone size={14}/> {t('checkout.phone')}</label>
                      <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full bg-slate-50 dark:bg-white/5 border ${errors.phone ? 'border-rose-500' : 'border-slate-100 dark:border-white/5'} rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold`} placeholder="01234567890" />
                      {errors.phone && <p className="text-rose-500 text-[10px] font-bold px-4">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4">{locale === 'ar' ? 'المدينة' : 'City'}</label>
                      <select 
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold appearance-none"
                      >
                        <option value="Alexandria">Alexandria</option>
                        <option value="Cairo">Cairo</option>
                        <option value="Giza">Giza</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4">{locale === 'ar' ? 'الرمز البريدي' : 'Postal Code'}</label>
                      <input 
                        value={formData.postalCode}
                        onChange={e => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold" 
                        placeholder="21500" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><MapPin size={14}/> {t('checkout.address')}</label>
                      <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`w-full bg-slate-50 dark:bg-white/5 border ${errors.address ? 'border-rose-500' : 'border-slate-100 dark:border-white/5'} rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold min-h-[100px]`} placeholder="123 Street, District, Alexandria" />
                      {errors.address && <p className="text-rose-500 text-[10px] font-bold px-4">{errors.address}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={handlePrev} className="flex items-center gap-2 text-slate-500 font-black hover:text-brand transition-colors"><ChevronLeft className={locale === 'ar' ? 'rotate-180' : ''} /> {t('wizard.prev')}</button>
                  <button onClick={handleNext} disabled={!formData.name || !formData.phone || !formData.address} className="group flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-black text-lg shadow-glow hover:scale-105 transition-all disabled:opacity-50">
                    {t('wizard.next')}
                    <ChevronRight className={`size-6 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-brand/10 shadow-glow">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand/10 rounded-2xl text-brand"><CreditCard className="size-6" /></div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('checkout.payment')}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <button onClick={() => setFormData({...formData, paymentMethod: 'cash'})} className={`p-8 rounded-[2rem] border-2 text-left transition-all ${formData.paymentMethod === 'cash' ? 'border-brand bg-brand/5' : 'border-slate-100 dark:border-white/5'}`}>
                      <p className="font-black text-xl mb-1">{locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</p>
                      <p className="text-sm text-slate-500 font-bold">{t('checkout.simulation')}</p>
                    </button>
                    <button onClick={() => setFormData({...formData, paymentMethod: 'card'})} className={`p-8 rounded-[2rem] border-2 text-left transition-all ${formData.paymentMethod === 'card' ? 'border-brand bg-brand/5' : 'border-slate-100 dark:border-white/5'}`}>
                      <p className="font-black text-xl mb-1">{locale === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</p>
                      <p className="text-sm text-slate-500 font-bold">{t('checkout.simulation')}</p>
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {formData.paymentMethod === 'card' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-6 p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                          <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><CreditCard size={14}/> {t('checkout.cardNumber')}</label>
                            <input value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} className={`w-full bg-white dark:bg-slate-900 border ${errors.cardNumber ? 'border-rose-500' : 'border-slate-200 dark:border-white/10'} rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-mono tracking-widest`} placeholder="0000 0000 0000 0000" maxLength={16} />
                            {errors.cardNumber && <p className="text-rose-500 text-[10px] font-bold px-4">{errors.cardNumber}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><Calendar size={14}/> {t('checkout.cardExpiry')}</label>
                            <input value={formData.cardExpiry} onChange={e => setFormData({...formData, cardExpiry: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold" placeholder="MM/YY" maxLength={5} />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4"><Lock size={14}/> CVV</label>
                            <input value={formData.cardCvv} onChange={e => setFormData({...formData, cardCvv: e.target.value})} type="password" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-brand/50 font-bold" placeholder="***" maxLength={3} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 text-amber-800 dark:text-amber-400 font-bold text-sm flex items-center gap-3">
                    <ShieldCheck className="size-5 flex-shrink-0" />
                    <span>* {locale === 'ar' ? 'هذه محاكاة لعملية الدفع لمشروع التخرج. لن يتم معالجة دفع حقيقي.' : 'This is a checkout simulation for the graduation project. No real payment will be processed.'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={handlePrev} className="flex items-center gap-2 text-slate-500 font-black hover:text-brand transition-colors"><ChevronLeft className={locale === 'ar' ? 'rotate-180' : ''} /> {t('wizard.prev')}</button>
                  <button onClick={submit} disabled={formData.paymentMethod === 'card' && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv)} className="group flex items-center gap-3 bg-brand text-white px-10 py-5 rounded-full font-black text-lg shadow-glow hover:scale-105 transition-all">
                    {t('checkout.placeOrder')}
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

function ShieldCheck(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;
}
