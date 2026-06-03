'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Locale } from '@/lib/translations';
import { normalizeEmail } from '@/lib/admin-access';

const SESSION_CHECK_TIMEOUT_MS = 8000;

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (((params?.locale as string) || 'en') === 'ar' ? 'ar' : 'en') as Locale;
  const isArabic = locale === 'ar';

  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const t = {
    title: isArabic ? 'الملف الشخصي' : 'Profile',
    subtitle: isArabic
      ? 'يمكنك تحديث اسم العرض وكلمة المرور من هنا. تغيير كلمة المرور يتطلب إدخال كلمة المرور الحالية.'
      : 'Update your display name and password here. Changing your password requires your current password.',
    backToDashboard: isArabic ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    displayName: isArabic ? 'اسم العرض' : 'Display Name',
    currentPassword: isArabic ? 'كلمة المرور الحالية' : 'Current Password',
    newPassword: isArabic ? 'كلمة المرور الجديدة' : 'New Password',
    confirmPassword: isArabic ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password',
    saveProfile: isArabic ? 'حفظ الاسم' : 'Save Name',
    savePassword: isArabic ? 'تحديث كلمة المرور' : 'Update Password',
    missingSession: isArabic ? 'جارٍ التحقق من الجلسة...' : 'Checking your session...',
    loginRequired: isArabic ? 'يجب تسجيل الدخول أولاً.' : 'Please sign in first.',
    passwordMismatch: isArabic ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.',
    passwordTooShort: isArabic ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.' : 'New password must be at least 6 characters.',
    displayNameSaved: isArabic ? 'تم تحديث اسم العرض بنجاح.' : 'Display name updated successfully.',
    passwordSaved: isArabic ? 'تم تحديث كلمة المرور بنجاح.' : 'Password updated successfully.',
  };

  useEffect(() => {
    let isCancelled = false;
    const fallbackTimer = setTimeout(() => {
      if (!isCancelled) {
        setCheckingSession(false);
      }
    }, SESSION_CHECK_TIMEOUT_MS);

    const bootstrap = async () => {
      if (typeof auth.authStateReady === 'function') {
        await auth.authStateReady();
      }

      if (isCancelled) {
        return;
      }

      const currentUser = auth.currentUser;
      if (!currentUser?.email) {
        setCheckingSession(false);
        router.replace(`/${locale}/login`);
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      setCheckingSession(false);
    };

    void bootstrap();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (isCancelled) {
        return;
      }

      if (!currentUser?.email) {
        setUser(null);
        router.replace(`/${locale}/login`);
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      setCheckingSession(false);
    });

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, [locale, router]);

  const saveDisplayName = async () => {
    if (!user) {
      setFeedback({ type: 'error', message: t.loginRequired });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);
      await updateProfile(user, { displayName: displayName.trim() || null });
      setUser({ ...user, displayName: displayName.trim() || null });
      setFeedback({ type: 'success', message: t.displayNameSaved });
    } catch (error) {
      console.error('Profile name update error:', error);
      setFeedback({
        type: 'error',
        message: isArabic ? 'تعذر حفظ اسم العرض.' : 'Failed to save display name.',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (!user?.email) {
      setFeedback({ type: 'error', message: t.loginRequired });
      return;
    }

    if (!currentPassword.trim()) {
      setFeedback({ type: 'error', message: isArabic ? 'أدخل كلمة المرور الحالية.' : 'Enter your current password.' });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: t.passwordTooShort });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: t.passwordMismatch });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const credential = EmailAuthProvider.credential(normalizeEmail(user.email), currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: t.passwordSaved });
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : undefined;

      console.error('Password update error:', error);
      setFeedback({
        type: 'error',
        message:
          code === 'auth/wrong-password' || code === 'auth/invalid-credential'
            ? isArabic
              ? 'كلمة المرور الحالية غير صحيحة.'
              : 'Current password is incorrect.'
            : code === 'auth/requires-recent-login'
              ? isArabic
                ? 'يرجى تسجيل الدخول مرة أخرى ثم حاول التحديث.'
                : 'Please sign in again and try updating your password.'
              : isArabic
                ? 'تعذر تحديث كلمة المرور.'
                : 'Failed to update password.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-24 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-10 text-center text-slate-300 shadow-2xl backdrop-blur-sm">
          {t.missingSession}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(222,59,52,0.18),_transparent_32%),linear-gradient(180deg,#0b1220_0%,#111827_55%,#0f172a_100%)] px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">{t.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">{t.subtitle}</p>
          </div>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex w-fit items-center justify-center rounded-full border border-[#DE3B34]/40 bg-[#DE3B34]/10 px-5 py-2.5 text-sm font-semibold text-[#FFD7D4] transition-colors hover:bg-[#DE3B34]/20"
          >
            {t.backToDashboard}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 md:p-6">
            <h2 className="text-lg font-semibold text-white">{isArabic ? 'المعلومات الأساسية' : 'Basic Information'}</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">{t.email}</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">{t.displayName}</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder={isArabic ? 'اسم العرض' : 'Display name'}
                  className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-[#DE3B34]"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => void saveDisplayName()}
                className="inline-flex rounded-xl bg-[#DE3B34] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#9B0F09] disabled:opacity-60"
              >
                {t.saveProfile}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 md:p-6">
            <h2 className="text-lg font-semibold text-white">{isArabic ? 'تحديث كلمة المرور' : 'Password Update'}</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">{t.currentPassword}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-[#DE3B34]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">{t.newPassword}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-[#DE3B34]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">{t.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-[#DE3B34]"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => void savePassword()}
                className="inline-flex rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                {t.savePassword}
              </button>
            </div>
          </section>
        </div>

        {feedback ? (
          <p className={`mt-6 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-red-400/30 bg-red-400/10 text-red-300'}`}>
            {feedback.message}
          </p>
        ) : null}
      </div>
    </main>
  );
}