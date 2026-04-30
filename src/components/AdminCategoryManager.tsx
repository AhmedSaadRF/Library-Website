"use client";

import { useBooks } from '@/contexts/BooksContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Category } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Folder, Plus } from 'lucide-react';

const emptyCategory: Category = {
  id: '',
  name_ar: '',
  name_en: ''
};

export function AdminCategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useBooks();
  const { locale, t } = useTranslation();
  const [form, setForm] = useState<Category>(emptyCategory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      updateCategory({ ...form, id: editingId });
      setEditingId(null);
      setForm(emptyCategory);
      setMessage('');
      return;
    }

    addCategory({ ...form, id: uuid() });
    setForm(emptyCategory);
    setMessage('');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-slate-500 dark:text-slate-400"
          >
            <Folder className="size-12 mx-auto mb-3 opacity-50" />
            <p className="font-bold">No categories yet</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-[2rem] border border-brand/10 bg-white p-6 dark:bg-slate-900 shadow-glow hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex-1"
                  >
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {locale === 'ar' ? category.name_ar : category.name_en}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                      {category.name_ar} / {category.name_en}
                    </p>
                  </motion.div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setEditingId(category.id);
                        setForm(category);
                      }}
                      className="rounded-full bg-sky-100 hover:bg-sky-200 px-4 py-2 text-sm font-bold text-sky-700 transition-all"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        const result = deleteCategory(category.id);
                        setMessage(result.success ? '' : t('admin.categoryHasBooks'));
                      }}
                      className="rounded-full bg-rose-100 hover:bg-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition-all"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 rounded-[2rem] border border-brand/10 bg-white p-6 shadow-glow dark:bg-slate-900"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="p-2 bg-brand/10 rounded-lg text-brand">
            <Folder className="size-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {editingId ? 'Edit Category' : 'Add Category'}
          </h3>
        </motion.div>

        <motion.input
          whileHover={{ borderColor: 'rgb(139, 90, 43)' }}
          value={form.name_ar}
          onChange={(e) => setForm((current) => ({ ...current, name_ar: e.target.value }))}
          placeholder={t('admin.categoryNameAr')}
          required
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2 dark:text-white transition-all focus:border-brand"
        />
        <motion.input
          whileHover={{ borderColor: 'rgb(139, 90, 43)' }}
          value={form.name_en}
          onChange={(e) => setForm((current) => ({ ...current, name_en: e.target.value }))}
          placeholder={t('admin.categoryNameEn')}
          required
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2 dark:text-white transition-all focus:border-brand"
        />
        {message ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-rose-600 font-bold p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg"
          >
            {message}
          </motion.p>
        ) : null}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full rounded-full bg-brand px-4 py-3 font-bold text-white shadow-glow hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="size-5" />
          {editingId ? 'Update' : 'Add'}
        </motion.button>
      </motion.form>
    </div>
  );
}
