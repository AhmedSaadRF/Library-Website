"use client";

import { PageShell } from '@/components/PageShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Avatar } from '@/components/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bookmark, Calendar, Clock, RotateCcw, CheckCircle2, Camera, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, updateProfilePicture, updateUserDetails, updatePassword, logout } = useAuth();
  const { borrowings, returnBook } = useBorrow();
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'info' | 'borrowings'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'borrowings') setActiveTab('borrowings');
    else if (tab === 'info') setActiveTab('info');
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleImageUploadAndSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError(locale === 'ar' ? 'حجم الصورة كبير جداً (الأقصى 2 ميجابايت)' : 'Image size too large (max 2MB)');
        return;
      }
      setImageUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await updateProfilePicture(base64);
        setImageUploading(false);
        if (result.success) {
          setSuccess(locale === 'ar' ? 'تم تحديث الصورة بنجاح' : 'Profile picture updated');
        } else {
          setError(result.message || (locale === 'ar' ? 'فشل تحديث الصورة' : 'Failed to update picture'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordChangeMode) {
      if (newPassword !== confirmPassword) {
        setError(locale === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
        return;
      }
      if (newPassword.length < 6) {
        setError(locale === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
        return;
      }
      setIsUpdating(true);
      const result = await updatePassword(oldPassword, newPassword);
      setIsUpdating(false);
      if (result.success) {
        setSuccess(locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
        setPasswordChangeMode(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message || (locale === 'ar' ? 'كلمة المرور القديمة غير صحيحة' : 'Incorrect old password'));
      }
      return;
    }

    if (name !== user?.name || email !== user?.email) {
      setIsUpdating(true);
      const result = await updateUserDetails(name, email, null, oldPassword);
      setIsUpdating(false);
      if (result.success) {
        setSuccess(locale === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
        setIsEditing(false);
        setOldPassword('');
      } else {
        setError(result.message || (locale === 'ar' ? 'كلمة المرور القديمة غير صحيحة' : 'Incorrect old password'));
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const tabs = [
    { id: 'info', label: locale === 'ar' ? 'المعلومات الشخصية' : 'Personal Info', icon: User },
    { id: 'borrowings', label: t('borrow.myBorrowings'), icon: Bookmark },
  ];

  const avatarSrc = user?.role === 'admin'
    ? '/images/logo.png'
    : (user?.profilePicture || '/images/default-avatar.png');

  return (
    <PageShell>
      <ProtectedRoute redirectTo="/profile">
        <div className="max-w-6xl mx-auto py-12">
          <div className="grid lg:grid-cols-[300px_1fr] gap-12">
            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-brand/10 shadow-glow text-center">
                <div className="relative mb-6 group">
                  <Avatar src={avatarSrc} name={user?.name || ''} size="xl" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-brand p-2 text-white shadow-lg transition-all hover:scale-110"
                    disabled={imageUploading}
                  >
                    {imageUploading ? <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera className="size-4" />}
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUploadAndSave} className="hidden" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h2>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-tighter mt-1">{user?.email}</p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-md font-black uppercase tracking-widest">
                  {user?.role === 'admin' ? (locale === 'ar' ? 'مُدير' : 'ADMIN') : (locale === 'ar' ? 'عضو' : 'User')}
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-6 flex items-center gap-2 rounded-full bg-rose-100 px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300"
                >
                  <LogOut className="h-4 w-4" />
                  {locale === 'ar' ? 'تسجيل خروج' : 'Logout'}
                </button>
              </div>

              <div className="flex flex-col gap-2 p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-3xl font-black transition-all ${
                      activeTab === tab.id
                        ? 'bg-brand text-white shadow-glow translate-x-2'
                        : 'text-slate-500 hover:text-brand dark:text-slate-400 dark:hover:text-brand-light'
                    }`}
                  >
                    <tab.icon className="size-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content */}
            <main>
              <AnimatePresence mode="wait">
                {activeTab === 'info' ? (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-brand/10 shadow-glow"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                          <User className="size-6" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                          {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                        </h2>
                      </div>
                      {!isEditing && !passwordChangeMode && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="rounded-full bg-brand px-6 py-2 text-sm font-black text-white shadow-glow hover:scale-105 transition-all"
                        >
                          {locale === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                      )}
                    </div>

                    {error && (
                      <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-rose-600 dark:bg-rose-900/20">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-emerald-600 dark:bg-emerald-900/20">
                        {success}
                      </div>
                    )}

                    {passwordChangeMode ? (
                      <form onSubmit={handleSaveChanges} className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">
                            {locale === 'ar' ? 'كلمة المرور القديمة' : 'Old Password'}
                          </label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-brand/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">
                            {locale === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-brand/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">
                            {locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-brand/50"
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setPasswordChangeMode(false);
                              setOldPassword('');
                              setNewPassword('');
                              setConfirmPassword('');
                              setError('');
                            }}
                            className="flex-1 rounded-full bg-slate-200 py-4 font-bold text-slate-700 dark:bg-slate-800"
                          >
                            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 rounded-full bg-brand py-4 font-bold text-white shadow-glow hover:scale-105 transition-all disabled:opacity-50"
                          >
                            {isUpdating ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (locale === 'ar' ? 'تغيير كلمة المرور' : 'Change Password')}
                          </button>
                        </div>
                      </form>
                    ) : isEditing ? (
                      <form onSubmit={handleSaveChanges} className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">{t('auth.name')}</label>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-brand/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">{t('auth.email')}</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-brand/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">
                            {locale === 'ar' ? 'كلمة المرور القديمة (للتأكيد)' : 'Old Password (for confirmation)'}
                          </label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-brand/50"
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setName(user?.name || '');
                              setEmail(user?.email || '');
                              setOldPassword('');
                              setError('');
                            }}
                            className="flex-1 rounded-full bg-slate-200 py-4 font-bold text-slate-700 dark:bg-slate-800"
                          >
                            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 rounded-full bg-brand py-4 font-bold text-white shadow-glow hover:scale-105 transition-all disabled:opacity-50"
                          >
                            {isUpdating ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">{t('auth.name')}</label>
                          <p className="px-4 py-4 text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-white/5 rounded-3xl">{user?.name}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">{t('auth.email')}</label>
                          <p className="px-4 py-4 text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-white/5 rounded-3xl">{user?.email}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">
                            {locale === 'ar' ? 'كلمة المرور' : 'Password'}
                          </label>
                          <button
                            onClick={() => setPasswordChangeMode(true)}
                            className="text-brand font-bold underline underline-offset-4 px-4 py-2 hover:scale-105 transition-all"
                          >
                            {locale === 'ar' ? 'تغيير كلمة المرور' : 'Change password'}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="borrowings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-brand/10 shadow-glow mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                          <Bookmark className="size-6" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('borrow.myBorrowings')}</h2>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {borrowings.length > 0 ? (
                        borrowings.map((b) => (
                          <div key={b.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-brand/10 shadow-glow flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-6">
                              <div className={`p-5 rounded-3xl ${b.status === 'active' ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-400'} flex-shrink-0`}>
                                {b.status === 'active' ? <Clock className="size-8" /> : <CheckCircle2 className="size-8" />}
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                  {locale === 'ar' ? b.bookTitle_ar : b.bookTitle_en}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    {b.borrowDate}
                                  </div>
                                  <div className="flex items-center gap-1 text-rose-500">
                                    <Clock className="size-4" />
                                    {t('borrow.dueDate')}: {b.dueDate}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${b.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {b.status === 'active' ? t('borrow.status.active') : t('borrow.status.returned')}
                              </div>
                              {b.status === 'active' && (
                                <button
                                  onClick={() => returnBook(b.id)}
                                  className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-black text-sm shadow-glow hover:scale-105 transition-all"
                                >
                                  <RotateCcw className="size-4" />
                                  {t('borrow.return')}
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-dashed border-slate-200 dark:border-white/10">
                          <p className="text-slate-400 font-black text-xl">{locale === 'ar' ? 'لا يوجد استعارات حالية' : 'No borrowings found'}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </PageShell>
  );
}