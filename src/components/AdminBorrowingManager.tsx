"use client";

import { useBorrow } from '@/contexts/BorrowContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Clock, CheckCircle2, User } from 'lucide-react';

export function AdminBorrowingManager() {
  const { borrowings } = useBorrow();
  const { locale, t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          {locale === 'ar' ? 'إدارة الاستعارات' : 'Manage Borrowings'}
        </h2>
        <div className="bg-brand/10 text-brand px-4 py-2 rounded-full font-black text-sm uppercase">
          {borrowings.length} {locale === 'ar' ? 'استعارة' : 'Borrowings'}
        </div>
      </div>

      <div className="grid gap-4">
        {borrowings.map((b) => (
          <div key={b.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-brand/10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${b.status === 'active' ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-400'}`}>
                {b.status === 'active' ? <Clock className="size-6" /> : <CheckCircle2 className="size-6" />}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {locale === 'ar' ? b.bookTitle_ar : b.bookTitle_en}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold mt-1">
                  <User className="size-4" />
                  {b.userEmail}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('borrow.dueDate')}</p>
              <p className="text-lg font-black text-rose-500">{b.dueDate}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
              b.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {b.status === 'active' ? t('borrow.status.active') : t('borrow.status.returned')}
            </div>
          </div>
        ))}
        {borrowings.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
            No borrowings yet.
          </div>
        )}
      </div>
    </div>
  );
}
