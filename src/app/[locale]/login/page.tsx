'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Locale } from '@/lib/translations';
import { getPrimaryAdminEmail, normalizeEmail, resolveDashboardLoginEmail } from '@/lib/admin-access';

const SESSION_CHECK_TIMEOUT_MS = 8000;

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (((params?.locale as string) || 'en') === 'ar' ? 'ar' : 'en') as Locale;
  const isArabic = locale === 'ar';
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authActionInProgress, setAuthActionInProgress] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const primaryAdminEmail = getPrimaryAdminEmail();

  const content = {
    en: {
      title: 'Admin / Editor Login',
      subtitle: 'Only the primary admin can open the dashboard immediately. Other users must be approved by admin first.',
      email: 'Email or Username',
      password: 'Password',
      showPassword: 'Show',
      hidePassword: 'Hide',
      passwordHint: 'No default password. Use the password set during account creation or admin invitation.',
      forgot: 'Access is managed by admin invitation.',
      login: 'Login',
      register: 'Create Account',
      google: 'Sign in with Google',
      noAccount: 'Need access first?',
      inviteNote: primaryAdminEmail
        ? `Primary admin: ${primaryAdminEmail}`
        : 'Set NEXT_PUBLIC_PRIMARY_ADMIN_EMAIL to define the primary admin.',
      backHome: 'Back to Home',
      denied: 'Your account is waiting for admin approval before dashboard access is granted.',
      inviteOnly: 'Your account was created/sign-in completed, but admin approval is still required.',
      invalid: 'Please enter a valid email address and password.',
    },
    ar: {
      title: 'تسجيل دخول الإدارة / المحررين',
      subtitle: 'يمكن فقط للبريد الإداري الرئيسي فتح اللوحة مباشرة. أما بقية المستخدمين فيحتاجون إلى موافقة المدير أولاً.',
      email: 'البريد الإلكتروني أو اسم المستخدم',
      password: 'كلمة المرور',
      showPassword: 'إظهار',
      hidePassword: 'إخفاء',
      passwordHint: 'لا توجد كلمة مرور افتراضية. استخدم كلمة المرور التي تم تعيينها أثناء إنشاء الحساب أو دعوة الإدارة.',
      forgot: 'تتم إدارة الوصول من خلال دعوة إدارية.',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      google: 'تسجيل الدخول عبر Google',
      noAccount: 'تحتاج إلى صلاحية أولاً؟',
      inviteNote: primaryAdminEmail
        ? `البريد الإداري الرئيسي: ${primaryAdminEmail}`
        : 'قم بتعيين NEXT_PUBLIC_PRIMARY_ADMIN_EMAIL لتحديد البريد الإداري الرئيسي.',
      backHome: 'العودة للرئيسية',
      denied: 'حسابك بانتظار موافقة المدير قبل منحك صلاحية دخول لوحة المدونة.',
      inviteOnly: 'تم إنشاء الحساب أو تسجيل الدخول، لكن ما زالت موافقة المدير مطلوبة.',
      invalid: 'يرجى إدخال بريد إلكتروني صالح وكلمة مرور.',
    },
  } as const;

  const t = content[isArabic ? 'ar' : 'en'];

  useEffect(() => {
    let isCancelled = false;
    const sessionFallbackTimer = setTimeout(() => {
      if (!isCancelled) {
        setCheckingSession(false);
      }
    }, SESSION_CHECK_TIMEOUT_MS);

    const handleExistingUser = async (user: User | null) => {
      if (isCancelled || authActionInProgress) {
        return;
      }

      if (!user?.email) {
        setCheckingSession(false);
        return;
      }

      if (!isCancelled) {
        setCheckingSession(false);
        router.replace(`/${locale}/dashboard`);
      }
    };

    const bootstrapSession = async () => {
      if (typeof auth.authStateReady === 'function') {
        await auth.authStateReady();
      }

      if (isCancelled) {
        return;
      }

      await handleExistingUser(auth.currentUser);
    };

    void bootstrapSession();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      void handleExistingUser(user);
    });

    return () => {
      isCancelled = true;
      clearTimeout(sessionFallbackTimer);
      unsubscribe();
    };
  }, [authActionInProgress, locale, router]);

  if (checkingSession && !authActionInProgress) {
    return (
      <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-24">
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md items-center justify-center rounded-2xl border border-amber-200/20 bg-white/[0.03] p-7 md:p-8 shadow-2xl backdrop-blur-sm">
          <p className="text-center text-sm text-slate-300 md:text-base">
            {isArabic ? 'جارٍ التحقق من الجلسة...' : 'Checking your session...'}
          </p>
        </div>
      </main>
    );
  }

  const resolveEmailForAuth = async (mode: 'login' | 'register') => {
    const normalizedIdentifier = loginIdentifier.trim();
    if (!normalizedIdentifier || !password.trim()) {
      setFeedback({ type: 'error', message: t.invalid });
      return null;
    }

    const normalizedUsernameAlias = normalizedIdentifier.toLowerCase();
    if (mode === 'login' && normalizedUsernameAlias === 'admin' && primaryAdminEmail) {
      return primaryAdminEmail;
    }

    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier);
    if (mode === 'register') {
      if (!looksLikeEmail) {
        setFeedback({
          type: 'error',
          message: isArabic ? 'استخدم البريد الإلكتروني لإنشاء الحساب.' : 'Use an email address to create an account.',
        });
        return null;
      }

      return normalizeEmail(normalizedIdentifier);
    }

    if (looksLikeEmail) {
      return normalizeEmail(normalizedIdentifier);
    }

    const resolvedEmail = await resolveDashboardLoginEmail(normalizedIdentifier);
    if (!resolvedEmail) {
      setFeedback({
        type: 'error',
        message: isArabic
          ? 'اسم المستخدم غير موجود. استخدم البريد الإلكتروني أو تواصل مع الإدارة.'
          : 'Username not found. Please use your email or contact admin.',
      });
      return null;
    }

    return resolvedEmail;
  };

  const runAuthAction = async (mode: 'login' | 'register') => {
    const normalizedEmail = await resolveEmailForAuth(mode);
    if (!normalizedEmail) {
      return;
    }

    try {
      setLoading(true);
      setAuthActionInProgress(true);
      setFeedback(null);

      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }
      setFeedback({ type: 'success', message: isArabic ? 'تم تسجيل الدخول بنجاح.' : 'Logged in successfully.' });
      router.replace(`/${locale}/dashboard`);
    } catch (error: unknown) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : undefined;
      let message = isArabic ? 'حدث خطأ غير متوقع.' : 'Unexpected error occurred.';

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        message = isArabic ? 'بيانات الدخول غير صحيحة.' : 'Invalid login credentials.';
      } else if (code === 'auth/email-already-in-use') {
        message = isArabic ? 'البريد الإلكتروني مستخدم بالفعل.' : 'Email is already in use.';
      } else if (code === 'auth/weak-password') {
        message = isArabic ? 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.' : 'Weak password. Use at least 6 characters.';
      }

      setFeedback({ type: 'error', message });
    } finally {
      setAuthActionInProgress(false);
      setLoading(false);
    }
  };

  const runGoogleLogin = async () => {
    try {
      setLoading(true);
      setAuthActionInProgress(true);
      setFeedback(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace(`/${locale}/dashboard`);
    } catch {
      setFeedback({
        type: 'error',
        message: isArabic ? 'فشل تسجيل الدخول عبر Google.' : 'Google sign-in failed.',

      });
    } finally {
      setAuthActionInProgress(false);
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-24">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-amber-200/20 bg-white/[0.03] p-7 md:p-8 shadow-2xl backdrop-blur-sm" dir={isArabic ? 'rtl' : 'ltr'}>
        <h1 className="mb-3 text-center text-3xl font-bold text-white">{t.title}</h1>
        <p className="mb-4 text-center text-sm text-slate-300 md:text-base">{t.subtitle}</p>
        <p className="mb-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-slate-300">{t.inviteNote}</p>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void runAuthAction('login');
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">{t.email}</label>
            <input
              type="text"
              value={loginIdentifier}
              onChange={(event) => setLoginIdentifier(event.target.value)}
              placeholder="example@email.com or username"
              className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-amber-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">{t.password}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 pr-20 text-slate-100 outline-none transition-colors focus:border-amber-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-amber-300 hover:text-amber-200"
              >
                {showPassword ? t.hidePassword : t.showPassword}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">{t.passwordHint}</p>
          </div>

          {feedback ? (
            <p className={`text-sm ${feedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {feedback.message}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-300 py-3 font-bold text-slate-900 transition-colors hover:bg-amber-200 disabled:opacity-60"
            >
              {t.login}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => void runAuthAction('register')}
              className="w-full rounded-xl border border-white/15 bg-white/5 py-3 font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
            >
              {t.register}
            </button>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => void runGoogleLogin()}
            className="w-full rounded-xl border border-white/15 py-3 font-semibold text-slate-100 transition-colors hover:bg-white/10 disabled:opacity-60"
          >
            {t.google}
          </button>

          <div className="text-center text-sm text-slate-300">
            <p className="mb-2">{t.noAccount}</p>
            <span className="text-amber-300">{t.forgot}</span>
          </div>
        </form>

        <div className="mt-7 text-center">
          <Link href={`/${locale}`} className="text-sm text-slate-300 transition-colors hover:text-white">
            {t.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
