'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import Logo from '../assets/logo/logo.png';
import { translations, Locale } from '@/lib/translations';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { ensureDashboardAccessRequest, normalizeEmail } from '@/lib/admin-access';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authContact, setAuthContact] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const isValidLoc = locale === 'en' || locale === 'ar';
  const lang = isValidLoc ? (locale as Locale) : 'en';
  const t = translations[lang];
  const currentUserLabelSource = currentUser?.displayName?.trim() || currentUser?.email?.trim() || '';
  const currentUserLabel = currentUserLabelSource.length > 25 ? `${currentUserLabelSource.slice(0, 25)}...` : currentUserLabelSource;
  const authText = lang === 'ar'
    ? {
        title: 'تسجيل الدخول / إنشاء حساب',
        subtitle: 'ادخل إلى حسابك أو أنشئ حساباً جديداً للمتابعة.',
        contact: 'رقم الهاتف أو البريد الإلكتروني',
        password: 'كلمة المرور',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        google: 'تسجيل الدخول عبر Google',
      }
    : {
        title: 'Login / Register',
        subtitle: 'Sign in to your account or create a new one to continue.',
        contact: 'Phone Number or Email Address',
        password: 'Password',
        login: 'Login',
        register: 'Create Account',
        google: 'Sign in with Google',
      };

  const switchLanguage = (newLocale: Locale) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const runAuthAction = async (mode: 'login' | 'register') => {
    setAuthFeedback(null);

    if (!authContact.trim() || !authPassword.trim()) {
      setAuthFeedback({
        type: 'error',
        message: lang === 'ar' ? 'يرجى إدخال رقم الهاتف/البريد وكلمة المرور.' : 'Please enter phone/email and password.',
      });
      return;
    }

    const normalizedEmail = normalizeEmail(authContact);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isEmail) {
      setAuthFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'تسجيل الدخول عبر الهاتف غير متاح حالياً. يرجى استخدام البريد الإلكتروني.'
            : 'Phone login is not enabled yet. Please use an email address.',
      });
      return;
    }

    try {
      setAuthLoading(true);
      let signedInEmail = normalizedEmail;

      if (mode === 'login') {
        const credential = await signInWithEmailAndPassword(auth, normalizedEmail, authPassword);
        signedInEmail = normalizeEmail(credential.user.email || normalizedEmail);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, authPassword);
        signedInEmail = normalizeEmail(credential.user.email || normalizedEmail);
      }

      const access = await ensureDashboardAccessRequest(signedInEmail);

      setAuthFeedback({
        type: 'success',
        message:
          access?.status === 'active'
            ? mode === 'login'
              ? lang === 'ar'
                ? 'تم تسجيل الدخول بنجاح.'
                : 'Logged in successfully.'
              : lang === 'ar'
                ? 'تم إنشاء الحساب بنجاح.'
                : 'Account created successfully.'
            : lang === 'ar'
              ? 'تم استلام طلب الوصول. سيتمكن المدير من الموافقة عليك قبل دخول لوحة المدونة.'
              : 'Access request received. The admin must approve you before you can open the dashboard.',
      });

      setTimeout(() => {
        setAuthModalOpen(false);
        setAuthContact('');
        setAuthPassword('');
        router.push(access?.status === 'active' ? `/${lang}/dashboard` : `/${lang}/login`);
      }, 700);
    } catch (error: unknown) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : undefined;
      let message = lang === 'ar' ? 'حدث خطأ غير متوقع.' : 'Unexpected error occurred.';

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        message = lang === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid login credentials.';
      } else if (code === 'auth/email-already-in-use') {
        message = lang === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل.' : 'Email is already in use.';
      } else if (code === 'auth/weak-password') {
        message = lang === 'ar' ? 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.' : 'Weak password. Use at least 6 characters.';
      }

      setAuthFeedback({ type: 'error', message });
    } finally {
      setAuthLoading(false);
    }
  };

  const runGoogleSignIn = async () => {
    try {
      if (currentUser?.email) {
        setAuthModalOpen(false);
        router.push(`/${lang}/dashboard`);
        return;
      }

      setAuthFeedback(null);
      setAuthLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const signedInEmail = result.user.email ? normalizeEmail(result.user.email) : '';
      const access = signedInEmail ? await ensureDashboardAccessRequest(signedInEmail) : null;

      setAuthFeedback({
        type: 'success',
        message:
          access?.status === 'active'
            ? lang === 'ar'
              ? 'تم تسجيل الدخول عبر Google بنجاح.'
              : 'Signed in with Google successfully.'
            : lang === 'ar'
              ? 'تم استلام طلب الوصول. بانتظار موافقة المدير.'
              : 'Access request received. Waiting for admin approval.',
      });
      setTimeout(() => {
        setAuthModalOpen(false);
        router.push(access?.status === 'active' ? `/${lang}/dashboard` : `/${lang}/login`);
      }, 600);
    } catch (error: unknown) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : undefined;
      let message = lang === 'ar' ? 'فشل تسجيل الدخول عبر Google.' : 'Google sign-in failed.';

      if (code === 'auth/popup-closed-by-user') {
        message = lang === 'ar' ? 'تم إغلاق نافذة تسجيل الدخول قبل الإكمال.' : 'Sign-in popup was closed before completion.';
      } else if (code === 'auth/popup-blocked') {
        message = lang === 'ar' ? 'تم حظر النافذة المنبثقة. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.' : 'Popup was blocked. Allow popups and try again.';
      } else if (code === 'auth/unauthorized-domain') {
        message = lang === 'ar' ? 'الدومين غير مصرح به في Firebase Authentication.' : 'This domain is not authorized in Firebase Authentication.';
      } else if (code === 'auth/operation-not-allowed') {
        message = lang === 'ar' ? 'تسجيل الدخول عبر Google غير مفعّل في Firebase.' : 'Google provider is not enabled in Firebase Auth.';
      }

      setAuthFeedback({
        type: 'error',
        message,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user && authModalOpen) {
        setAuthModalOpen(false);
      }
    });
    return () => unsubscribe();
  }, [authModalOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAccountMenuOpen(false);
    } catch (error: unknown) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Update scroll state for background opacity
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    const closeMenu = () => setAccountMenuOpen(false);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [accountMenuOpen]);

  return (
    <>
    <nav className={`fixed top-0 z-50 flex justify-center w-full transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div
        className={`
          w-full max-w-[1250px] px-4 md:px-8 transition-all duration-300
          border border-white/20
          shadow-xl text-white
          rounded-b-[18px]
          bg-gradient-to-r from-[#160A0A] via-[#160A0A] to-[#160A0A]
          backdrop-blur-2xl bg-opacity-60
        `}
        style={{ WebkitBackdropFilter: 'blur(16px) saturate(140%)', backdropFilter: 'blur(16px) saturate(140%)' }}
      >
        <div className="flex items-center justify-between py-2 md:py-2.5">
          {/* Logo always on the left */}
          <Link
            href={`/${lang}`}
            className={`flex items-center gap-2 md:gap-3 cursor-pointer ${lang === 'ar' ? 'order-1' : 'order-1'}`}
          >
            <Image src={Logo} alt="Almahy Legal Services Logo" width={150} height={100} className="object-contain md:w-[150px] md:h-[55px]" priority />
          </Link>

          {/* Center: Navigation Links */}
          <div className={`hidden md:flex items-center gap-6 lg:gap-10 order-2 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Link href={`/${lang}`} className="text-sm font-medium text-white transition-colors whitespace-nowrap" style={{color: 'white'}} onMouseEnter={(e) => e.currentTarget.style.color = '#DE3B34'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              {t.home}
            </Link>
            <Link href={`/${lang}/services`} className="text-sm font-medium text-white transition-colors whitespace-nowrap" style={{color: 'white'}} onMouseEnter={(e) => e.currentTarget.style.color = '#DE3B34'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              {t.ourServices}
            </Link>
            <Link href={`/${lang}/pricing-table`} className="text-sm font-medium text-white transition-colors whitespace-nowrap" style={{color: 'white'}} onMouseEnter={(e) => e.currentTarget.style.color = '#DE3B34'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              {t.pricing}
            </Link>
            <Link href={`/${lang}/blogs`} className="text-sm font-medium text-white transition-colors whitespace-nowrap" style={{color: 'white'}} onMouseEnter={(e) => e.currentTarget.style.color = '#DE3B34'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              {t.blogs}
            </Link>
            <Link href={`/${lang}/about`} className="text-sm font-medium text-white transition-colors whitespace-nowrap" style={{color: 'white'}} onMouseEnter={(e) => e.currentTarget.style.color = '#DE3B34'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              {t.whoAreWe}
            </Link>
            <Link href={`/${lang}/contact`} className="text-sm font-medium text-white transition-colors whitespace-nowrap" style={{color: 'white'}} onMouseEnter={(e) => e.currentTarget.style.color = '#DE3B34'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              {t.contactUs}
            </Link>
          </div>

          {/* Right: Button and Language Switcher */}
          <div className={`flex items-center gap-2 md:gap-4 ${lang === 'ar' ? 'order-3' : 'order-3'}`}>
            <div className="hidden md:flex items-center rounded-full border border-[#6C2B27] bg-[#170C0C]/95 p-1 backdrop-blur">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  lang === 'en'
                    ? 'bg-[#4A1C1A] text-[#F2D6D4] shadow-[0_4px_12px_rgba(0,0,0,0.28)]'
                    : 'text-[#B98B89] hover:bg-[#241212] hover:text-[#DFC1BF]'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('ar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  lang === 'ar'
                    ? 'bg-[#4A1C1A] text-[#F2D6D4] shadow-[0_4px_12px_rgba(0,0,0,0.28)]'
                    : 'text-[#B98B89] hover:bg-[#241212] hover:text-[#DFC1BF]'
                }`}
                aria-label="Switch to Arabic"
              >
                AR
              </button>
            </div>

            {currentUser ? (
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setAccountMenuOpen(true)}
                onMouseLeave={() => setAccountMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setAccountMenuOpen((open) => !open);
                  }}
                  className="font-bold px-4 md:px-7 py-2.5 md:py-3 rounded-full text-xs md:text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: '#231111',
                    color: '#F0D4D2',
                    border: '1px solid #7A302C',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.35)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2A1414';
                    e.currentTarget.style.borderColor = '#A5443E';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#231111';
                    e.currentTarget.style.borderColor = '#7A302C';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)';
                  }}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || currentUser.email || 'User profile'}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0" />
                    </svg>
                  )}
                  <span className="hidden xs:inline md:inline">{lang === 'en' ? `Hi, ${currentUserLabel}` : `${currentUserLabel} ،مرحباً`}</span>
                  <svg className={`h-4 w-4 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {accountMenuOpen ? (
                  <div
                    className="absolute right-0 top-[calc(100%-2px)] w-56 overflow-hidden rounded-2xl border border-[#6C2B27] bg-[#1A0D0D]/95 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        router.push(`/${lang}/dashboard`);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#F0D4D2] transition-colors hover:bg-[#2A1414]"
                    >
                      <span>{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
                      <span className="text-[#B98B89]">/</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        router.push(`/${lang}/dashboard`);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#F0D4D2] transition-colors hover:bg-[#2A1414]"
                    >
                      <span>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                      <span className="text-[#B98B89]">/</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleLogout()}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#FFB6B6] transition-colors hover:bg-[#341313]"
                    >
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                      <span className="text-[#D86A64]">/</span>
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden backdrop-blur-lg border-t -mx-4 -mr-4 px-4" style={{backgroundColor: `rgba(24, 24, 24, ${isScrolled ? 0.95 : 0.85})`, borderTopColor: `rgba(128, 128, 128, ${isScrolled ? 1 : 0.5})`}}>
            <div className="py-3 space-y-2">
              <Link
                href={`/${lang}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                style={{}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.home}
              </Link>
              <Link
                href={`/${lang}/services`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                style={{}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.ourServices}
              </Link>
              <Link
                href={`/${lang}/pricing-table`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                style={{}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.pricing}
              </Link>
              <Link
                href={`/${lang}/about`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                style={{}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.whoAreWe}
              </Link>
              <Link
                href={`/${lang}/blogs`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                style={{}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.blogs}
              </Link>
              <Link
                href={`/${lang}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                style={{}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.contactUs}
              </Link>
              <div className={`flex gap-2 pt-2 border-t ${isScrolled ? 'border-gray-700' : 'border-gray-700/50'}`}>
                <button
                  onClick={() => {
                    switchLanguage('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-2 py-2 text-xs font-semibold rounded transition-all ${
                    lang === 'en'
                      ? 'bg-[#4A1C1A] text-[#F2D6D4]'
                      : 'bg-[#2A1515] text-[#B98B89] hover:bg-[#341A1A]'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    switchLanguage('ar');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-2 py-2 text-xs font-semibold rounded transition-all ${
                    lang === 'ar'
                      ? 'bg-[#4A1C1A] text-[#F2D6D4]'
                      : 'bg-[#2A1515] text-[#B98B89] hover:bg-[#341A1A]'
                  }`}
                >
                  AR
                </button>
              </div>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(`/${lang}/dashboard`);
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-sm font-bold text-[#F0D4D2] transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                  style={{
                    backgroundColor: '#231111',
                    border: '1px solid #7A302C'
                  }}
                >
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || currentUser.email || 'User profile'}
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0" />
                    </svg>
                  )}
                  {lang === 'en' ? `Hi, ${currentUserLabel}` : `${currentUserLabel} ،مرحباً`}
                </button>
              ) : null}
              {currentUser ? (
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(`/${lang}/dashboard`);
                    }}
                    className="block w-full rounded-xl border border-[#6C2B27] px-4 py-2.5 text-left text-sm font-semibold text-[#F0D4D2] transition-colors hover:bg-[#241212]"
                  >
                    {lang === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void handleLogout();
                    }}
                    className="block w-full rounded-xl border border-[#6C2B27] px-4 py-2.5 text-left text-sm font-semibold text-[#FFB6B6] transition-colors hover:bg-[#241212]"
                  >
                    {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

    </nav>
    {authModalOpen && (
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4"
        onClick={() => setAuthModalOpen(false)}
      >
        <div
          className="w-full max-w-3xl flex rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(22,10,10,0.35)]"
          onClick={(e) => e.stopPropagation()}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Left: Red Gradient Brand Side */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#DE3B34] to-[#9B0F09] p-14 flex-col justify-center items-center text-center text-white relative">
            <div className="mb-16 px-2 py-4">
              <Image src={Logo} alt="Almahy Logo" width={160} height={60} className="object-contain" />
            </div>
            <h2 className="text-4xl font-bold mb-5">Welcome Back</h2>
            <p className="text-white/85 text-sm leading-relaxed max-w-xs">
              Sign in to your portal to access your account, manage transactions, and view your financial information securely.
            </p>
          </div>

          {/* Right: Form Side */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-10 relative">
            <button
              type="button"
              className="absolute top-3 right-3 md:hidden text-slate-500 hover:text-[#160A0A] text-2xl leading-none"
              onClick={() => setAuthModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            
            <div className="md:hidden mb-6 text-center">
              <div className="mx-auto mb-4 w-fit px-3 py-3">
                <Image src={Logo} alt="Almahy Logo" width={150} height={56} className="object-contain" />
              </div>
            </div>

            <div className="mb-7">
              <h3 className="text-2xl font-bold text-slate-900">Almahy Portal Login</h3>
              <p className="text-slate-600 text-sm mt-2">{authText.subtitle}</p>
            </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              runAuthAction('login');
            }}
          >
            <input
              type="text"
              placeholder={authText.contact}
              className="w-full rounded-xl border-2 border-[#CECDCB] bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 placeholder:font-medium outline-none transition-all focus:border-[#DE3B34] focus:shadow-[0_0_0_3px_rgba(222,59,52,0.1)]"
              value={authContact}
              onChange={(e) => setAuthContact(e.target.value)}
            />
            <input
              type="password"
              placeholder={authText.password}
              className="w-full rounded-xl border-2 border-[#CECDCB] bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 placeholder:font-medium outline-none transition-all focus:border-[#DE3B34] focus:shadow-[0_0_0_3px_rgba(222,59,52,0.1)]"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            {authFeedback ? (
              <p className={`text-sm ${authFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {authFeedback.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl py-3.5 font-bold text-white transition-all duration-200 disabled:opacity-70 shadow-[0_8px_18px_rgba(22,10,10,0.25)] hover:shadow-[0_10px_22px_rgba(22,10,10,0.32)]"
              style={{
                backgroundColor: '#DE3B34'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C93028'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DE3B34'}
            >
              {authLoading ? (lang === 'ar' ? 'جارٍ المعالجة...' : 'Processing...') : authText.login}
            </button>
            <button
              type="button"
              onClick={() => {
                void runGoogleSignIn();
              }}
              disabled={authLoading}
              className="w-full rounded-xl border-2 border-[#CECDCB] bg-white py-3 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.4l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.2-4.8 9.2-7.3 0-.5-.1-.9-.1-1.3H12z"/>
              </svg>
              {authText.google}
            </button>
            <button
              type="button"
              onClick={() => {
                void runAuthAction('register');
              }}
              disabled={authLoading}
              className="w-full rounded-xl border-2 border-[#DE3B34] bg-white py-3 font-bold text-[#DE3B34] hover:bg-[#FFB6B6]/20 transition-all"
            >
              {authText.register}
            </button>
          </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
}