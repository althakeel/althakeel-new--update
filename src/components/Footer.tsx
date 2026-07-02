'use client';

import Link from "next/link";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { translations, Locale } from '@/lib/translations';

const contactLinks = [
  {
    label: "info@almahy.com",
    href: "mailto:info@almahy.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6.8c0-.993.0-1.49.194-1.86a1.6 1.6 0 0 1 .696-.696C5.26 4 5.757 4 6.75 4h10.5c.993 0 1.49 0 1.86.244.3.194.502.479.605.802.076.238.076.508.076 1.346v7.416c0 .993 0 1.49-.244 1.86a1.6 1.6 0 0 1-.696.696c-.31.2-.68.244-1.24.257v0l-11.7.019c-.993 0-1.49 0-1.86-.244a1.6 1.6 0 0 1-.696-.696C4 15.23 4 14.734 4 13.74Z" />
        <path d="m5 6 7 5 7-5" />
      </svg>
    ),
  },
  {
    label: "legal@almahy.com",
    href: "mailto:legal@almahy.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6.8c0-.993.0-1.49.194-1.86a1.6 1.6 0 0 1 .696-.696C5.26 4 5.757 4 6.75 4h10.5c.993 0 1.49 0 1.86.244.3.194.502.479.605.802.076.238.076.508.076 1.346v7.416c0 .993 0 1.49-.244 1.86a1.6 1.6 0 0 1-.696.696c-.31.2-.68.244-1.24.257v0l-11.7.019c-.993 0-1.49 0-1.86-.244a1.6 1.6 0 0 1-.696-.696C4 15.23 4 14.734 4 13.74Z" />
        <path d="m5 6 7 5 7-5" />
      </svg>
    ),
  },
  {
    label: "+971 4264 8831",
    href: "tel:+97142648831",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6.5 3h3l1 4-2 .8a10 10 0 0 0 4.2 4.2l.8-2 4 1v3a2 2 0 0 1-2.3 2 16 16 0 0 1-7.7-3.6 16 16 0 0 1-3.6-7.7A2 2 0 0 1 6.5 3Z" />
      </svg>
    ),
  },
  {
    label: "+971 5040 96028",
    href: "tel:+971504096028",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6.5 3h3l1 4-2 .8a10 10 0 0 0 4.2 4.2l.8-2 4 1v3a2 2 0 0 1-2.3 2 16 16 0 0 1-7.7-3.6 16 16 0 0 1-3.6-7.7A2 2 0 0 1 6.5 3Z" />
      </svg>
    ),
  },
  
];

export default function Footer({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const isValidLoc = locale === 'en' || locale === 'ar';
  const lang = isValidLoc ? (locale as Locale) : 'en';
  const t = translations[lang];

  const switchLanguage = (newLocale: Locale) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [newsletterFeedback, setNewsletterFeedback] = useState('');

  const newsletterCopy = {
    sending: lang === 'ar' ? 'جارٍ الاشتراك...' : 'Subscribing...',
    success: lang === 'ar' ? 'شكراً لاشتراكك!' : 'Thank you for subscribing!',
    error: lang === 'ar' ? 'تعذّر الاشتراك. حاول مرة أخرى.' : "Couldn't subscribe. Please try again.",
    invalid: lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email.',
  };

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterStatus('error');
      setNewsletterFeedback(newsletterCopy.invalid);
      return;
    }

    setNewsletterStatus('sending');
    setNewsletterFeedback('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.success) {
        setNewsletterStatus('success');
        setNewsletterFeedback(newsletterCopy.success);
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterFeedback(json?.message || newsletterCopy.error);
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterFeedback(newsletterCopy.error);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#160A0A] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#DE3B34]/25 blur-3xl" />
        <div className="absolute right-10 top-0 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute left-1/2 bottom-[-40px] h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 py-14 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{t.footerOurAddress}</h3>
              <span className="h-px w-14 bg-gradient-to-r from-[#DE3B34]/80 to-transparent" aria-hidden />
            </div>
            <div className="space-y-1 text-sm text-white/85 leading-relaxed">
              <p>2nd Floor, Al Saqr Business Tower</p>
              <p>Sheikh Zayed Rd, DIFC</p>
              <p>Dubai, United Arab Emirates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{t.footerConnectWithUs}</h3>
              <span className="h-px w-14 bg-gradient-to-r from-[#DE3B34]/80 to-transparent" aria-hidden />
            </div>
            <ul className="space-y-3 text-sm text-white/85">
              {contactLinks.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-[#DE3B34] ring-1 ring-white/10">
                    {item.icon}
                  </span>
                  {item.href.startsWith('tel:') || item.href.startsWith('mailto:') ? (
                    <a href={item.href} className="transition hover:text-[#DE3B34]">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="transition hover:text-[#DE3B34]">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{t.footerNewsletter}</h3>
              <span className="h-px w-14 bg-gradient-to-r from-[#DE3B34] /80 to-transparent" aria-hidden />
            </div>
            <p className="text-sm text-white/80">{t.footerNewsletterDesc}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 shadow-inner shadow-black/20">
              <input
                type="email"
                name="newsletter"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t.footerEmailPlaceholder}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'sending'}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#DE3B34] text-black shadow-lg shadow-[#DE3B34]/30 transition hover:translate-y-[-1px] hover:bg-[#FFB6B6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#160A0A] focus:ring-[#DE3B34] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Subscribe"
              >
                {newsletterStatus === 'sending' ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m4 10 7 3 9-7-16 4-1 7 4-4" />
                  </svg>
                )}
              </button>
            </form>
            {newsletterFeedback && (
              <p className={`text-sm ${newsletterStatus === 'success' ? 'text-emerald-300' : 'text-[#FFB6B6]'}`}>
                {newsletterFeedback}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footerText}</p>
          <div className="flex gap-4 text-white/70 items-center">
            <Link href={`/${lang}/privacy`} className="hover:text-[#DE3B34]">{t.footerPrivacy}</Link>
            <Link href={`/${lang}/terms`} className="hover:text-[#DE3B34]">{t.footerTerms}</Link>
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  lang === 'en'
                    ? 'bg-amber-400 text-gray-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('ar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  lang === 'ar'
                    ? 'bg-amber-400 text-gray-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                AR
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
