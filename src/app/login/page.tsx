'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  ensureDashboardAccessRequest,
  getPrimaryAdminEmail,
  normalizeEmail,
  normalizeUsername,
  resolveDashboardLoginEmail,
} from '@/lib/admin-access';

const SESSION_CHECK_TIMEOUT_MS = 8000;

export default function LoginPage() {
  const router = useRouter();
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authActionInProgress, setAuthActionInProgress] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const primaryAdminEmail = getPrimaryAdminEmail();

  const t = {
    title: 'Admin / Editor Login',
    subtitle: 'Only the primary admin can open the dashboard immediately. Other users must be approved by admin first.',
    email: 'Email or Username',
    password: 'Password',
    forgot: 'Access is managed by admin invitation.',
    login: 'Login',
    register: 'Create Account',
    google: 'Sign in with Google',
    noAccount: 'Need access first?',
    inviteNote: primaryAdminEmail
      ? `Primary admin: ${primaryAdminEmail}`
      : 'Set NEXT_PUBLIC_PRIMARY_ADMIN_EMAIL to define the primary admin.',
    backHome: 'Back to Home',
    inviteOnly: 'Your account was created/sign-in completed, but admin approval is still required.',
    invalid: 'Please enter a valid email address and password.',
  };

  useEffect(() => {
    let isCancelled = false;
    const sessionFallbackTimer = setTimeout(() => {
      if (!isCancelled) {
        setCheckingSession(false);
      }
    }, SESSION_CHECK_TIMEOUT_MS);

    const handleExistingUser = async (user: User | null) => {
      if (isCancelled || authActionInProgress) return;

      if (!user?.email) {
        setCheckingSession(false);
        return;
      }

      setCheckingSession(false);
      router.replace('/en/dashboard');
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
  }, [authActionInProgress, router]);

  if (checkingSession && !authActionInProgress) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-24 flex items-center justify-center">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-amber-200/20 bg-white/[0.03] p-7 md:p-8 shadow-2xl backdrop-blur-sm text-center text-slate-300">
          Checking your session...
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

    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier);
    if (mode === 'register') {
      if (!looksLikeEmail) {
        setFeedback({ type: 'error', message: 'Use an email address to create an account.' });
        return null;
      }
      return normalizeEmail(normalizedIdentifier);
    }

    if (looksLikeEmail) {
      return normalizeEmail(normalizedIdentifier);
    }

    const resolvedEmail = await resolveDashboardLoginEmail(normalizedIdentifier);
    if (!resolvedEmail) {
      setFeedback({ type: 'error', message: 'Username not found. Please use your email or contact admin.' });
      return null;
    }

    return resolvedEmail;
  };

  const runAuthAction = async (mode: 'login' | 'register') => {
    const normalizedEmail = await resolveEmailForAuth(mode);
    if (!normalizedEmail) return;

    try {
      setLoading(true);
      setAuthActionInProgress(true);
      setFeedback(null);

      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }

      const access = await ensureDashboardAccessRequest(
        normalizedEmail,
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier.trim())
          ? undefined
          : normalizeUsername(loginIdentifier)
      );

      if (access?.status === 'active') {
        setFeedback({ type: 'success', message: 'Logged in successfully.' });
        router.replace('/en/dashboard');
        return;
      }

      router.replace('/portal');
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      let message = 'Unexpected error occurred.';

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        message = 'Invalid login credentials.';
      } else if (code === 'auth/email-already-in-use') {
        message = 'Email is already in use.';
      } else if (code === 'auth/weak-password') {
        message = 'Weak password. Use at least 6 characters.';
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
      const result = await signInWithPopup(auth, provider);
      const signedInEmail = result.user.email ? normalizeEmail(result.user.email) : '';
      const access = signedInEmail ? await ensureDashboardAccessRequest(signedInEmail) : null;

      if (access?.status === 'active') {
        router.replace('/en/dashboard');
        return;
      }

      router.replace('/portal');
    } catch {
      setFeedback({ type: 'error', message: 'Google sign-in failed.' });
    } finally {
      setAuthActionInProgress(false);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-24 flex items-center justify-center">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-amber-200/20 bg-white/[0.03] p-7 md:p-8 shadow-2xl backdrop-blur-sm">
        <h1 className="mb-3 text-center text-3xl font-bold text-white">{t.title}</h1>
        <p className="mb-4 text-center text-sm text-slate-300 md:text-base">{t.subtitle}</p>
        <p className="mb-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-slate-300">
          {t.inviteNote}
        </p>

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
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-amber-300"
            />
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
          <Link href="/" className="text-sm text-slate-300 transition-colors hover:text-white">
            {t.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
