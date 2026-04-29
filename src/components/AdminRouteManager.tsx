"use client";

import { useRouteStops } from '@/contexts/RouteContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { RouteStop } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const emptyForm: RouteStop = {
  id: '',
  name_ar: '',
  name_en: '',
  lat: 31.2,
  lng: 29.91,
  description_ar: '',
  description_en: '',
  date_ar: '',
  date_en: '',
  time_ar: '',
  time_en: '',
  order: 1
};

export function AdminRouteManager() {
  const { stops, addStop, updateStop, deleteStop, moveStop } = useRouteStops();
  const { locale, t } = useTranslation();
  const [form, setForm] = useState<RouteStop>({ ...emptyForm, order: stops.length + 1 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      updateStop({ ...form, id: editingId });
      setEditingId(null);
      setForm({ ...emptyForm, order: stops.length + 1 });
      return;
    }

    addStop({ ...form, id: uuid(), order: stops.length + 1 });
    setForm({ ...emptyForm, order: stops.length + 2 });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <AnimatePresence>
          {[...stops]
            .sort((a, b) => a.order - b.order)
            .map((stop) => (
              <motion.div
                key={stop.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="rounded-[2rem] border border-brand/10 bg-white p-5 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {locale === 'ar' ? stop.name_ar : stop.name_en}
                    </h3>
                    <p className="text-xs text-brand font-bold mt-1">
                      {locale === 'ar' ? stop.date_ar : stop.date_en} | {locale === 'ar' ? stop.time_ar : stop.time_en}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                      {stop.lat}, {stop.lng}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moveStop(stop.id, 'up')}
                      className="rounded-full bg-brand/10 px-3 py-2 text-sm font-semibold text-brand"
                    >
                      {t('admin.moveUp')}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStop(stop.id, 'down')}
                      className="rounded-full bg-brand/10 px-3 py-2 text-sm font-semibold text-brand"
                    >
                      {t('admin.moveDown')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(stop.id);
                        setForm(stop);
                      }}
                      className="rounded-full bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700"
                    >
                      {t('admin.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStop(stop.id)}
                      className="rounded-full bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700"
                    >
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <motion.form
        onSubmit={submit}
        className="space-y-4 rounded-[2rem] border border-brand/10 bg-white p-6 shadow-glow dark:bg-slate-900"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            value={form.name_ar}
            onChange={(e) => setForm((current) => ({ ...current, name_ar: e.target.value }))}
            placeholder="اسم المحطة (بالعربي)"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
          <input
            required
            value={form.name_en}
            onChange={(e) => setForm((current) => ({ ...current, name_en: e.target.value }))}
            placeholder="Stop Name (English)"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            required
            type="number"
            step="0.0001"
            value={form.lat}
            onChange={(e) => setForm((current) => ({ ...current, lat: Number(e.target.value) }))}
            placeholder="Latitude"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
          <input
            required
            type="number"
            step="0.0001"
            value={form.lng}
            onChange={(e) => setForm((current) => ({ ...current, lng: Number(e.target.value) }))}
            placeholder="Longitude"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            required
            value={form.date_ar}
            onChange={(e) => setForm((current) => ({ ...current, date_ar: e.target.value }))}
            placeholder="التاريخ (مثال: 15 مايو)"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
          <input
            required
            value={form.date_en}
            onChange={(e) => setForm((current) => ({ ...current, date_en: e.target.value }))}
            placeholder="Date (e.g. May 15)"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            required
            value={form.time_ar}
            onChange={(e) => setForm((current) => ({ ...current, time_ar: e.target.value }))}
            placeholder="الوقت (بالعربي)"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
          <input
            required
            value={form.time_en}
            onChange={(e) => setForm((current) => ({ ...current, time_en: e.target.value }))}
            placeholder="Time (English)"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        </div>

        <textarea
          required
          value={form.description_ar}
          onChange={(e) => setForm((current) => ({ ...current, description_ar: e.target.value }))}
          placeholder="الوصف (بالعربي)"
          className="min-h-24 w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
        />
        <textarea
          required
          value={form.description_en}
          onChange={(e) => setForm((current) => ({ ...current, description_en: e.target.value }))}
          placeholder="Description (English)"
          className="min-h-24 w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
        />

        <button type="submit" className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white">
          {editingId ? t('admin.updateStop') : t('admin.addStop')}
        </button>
      </motion.form>
    </div>
  );
}
