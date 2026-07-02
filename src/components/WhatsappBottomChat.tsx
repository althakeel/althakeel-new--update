'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

function WhatsappIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.05 4.94A9.9 9.9 0 0 0 12.02 2C6.53 2 2.06 6.46 2.06 11.96c0 1.76.46 3.48 1.33 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.8 1.23h.01c5.49 0 9.96-4.47 9.96-9.96a9.9 9.9 0 0 0-2.92-6.97ZM12 20.19h-.01a8.26 8.26 0 0 1-4.21-1.15l-.3-.18-3.09.81.83-3.01-.2-.31a8.24 8.24 0 0 1-1.28-4.39c0-4.56 3.71-8.28 8.28-8.28a8.2 8.2 0 0 1 5.86 2.44 8.22 8.22 0 0 1 2.41 5.86c0 4.57-3.71 8.29-8.28 8.29Zm4.54-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.12-.17.25-.64.81-.79.98-.15.17-.29.19-.54.06-.25-.13-1.04-.38-1.99-1.22-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.77-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.13.17 1.75 2.68 4.25 3.76.59.25 1.06.4 1.42.51.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

const AUTO_CLOSE_MS = 30000;

export default function WhatsappBottomChat() {
  const pathname = usePathname();
  const isArabic = pathname?.startsWith('/ar');
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const cancelCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const startCloseTimer = () => {
    cancelCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
  };

  const openChat = () => {
    setOpen(true);
    startCloseTimer();
  };

  const closeChat = () => {
    setOpen(false);
    cancelCloseTimer();
  };

  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER || '971555020940';
  const phone = rawPhone.replace(/[^\d]/g, '');

  const prefilledMessage = isArabic
    ? 'مرحباً، لدي استفسار وارغب في التحدث مع مستشار.'
    : 'Hi i have a enquiry and would like to speak with a consultant';
  const [message, setMessage] = useState(prefilledMessage);

  const chatUrl = useMemo(() => {
    const text = encodeURIComponent(prefilledMessage);
    return `https://wa.me/${phone}?text=${text}`;
  }, [phone, prefilledMessage]);

  const handleSend = () => {
    const finalMessage = message.trim() || prefilledMessage;
    const encoded = encodeURIComponent(finalMessage);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    const scopedWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
    if (!Array.isArray(scopedWindow.dataLayer)) {
      scopedWindow.dataLayer = [];
    }
    scopedWindow.dataLayer.push({
      event: 'whatsapp_click',
      whatsapp_url: url,
      link_text: isArabic ? 'ارسال واتساب' : 'Send WhatsApp',
      page_path: window.location.pathname,
      source: 'whatsapp_bottom_chat',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage(prefilledMessage);
    setOpen(false);
  };

  useEffect(() => {
    setMessage(prefilledMessage);
  }, [prefilledMessage]);

  useEffect(() => {
    setOpen(true);
    const id = window.setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    closeTimerRef.current = id;

    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6">
      <div
        onMouseEnter={cancelCloseTimer}
        onMouseLeave={() => open && startCloseTimer()}
        className={`mb-3 w-[320px] min-h-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl bg-[#ECE5DD] shadow-[0_24px_55px_rgba(0,0,0,0.28)] transition-all duration-500 ease-out ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
        }`}
      >
          <div className="flex items-center justify-between bg-[#128C7E] px-4 py-2.5 text-white">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/almahylogo.jpeg"
                alt="Almahy Legal Services"
                className="h-9 w-9 rounded-full object-cover ring-1 ring-white/35"
              />
              <div className="leading-tight">
                <p className="text-sm font-semibold">Almahy Legal Services</p>
                <p className="text-[11px] text-white/85">online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded p-1.5 transition-colors hover:bg-white/15"
                aria-label={isArabic ? 'مكالمة فيديو' : 'Video call'}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.75 6.5A1.75 1.75 0 014.5 4.75h6A1.75 1.75 0 0112.25 6.5v7A1.75 1.75 0 0110.5 15.25h-6A1.75 1.75 0 012.75 13.5v-7Zm9.5 2.1 4.2-2.3a.5.5 0 01.74.44v6.52a.5.5 0 01-.74.44l-4.2-2.3V8.6Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="rounded p-1 transition-colors hover:bg-white/15"
                aria-label={isArabic ? 'اغلاق' : 'Close'}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 01-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex min-h-[280px] flex-col bg-[#ECE5DD] p-3.5 text-[#4A4D57]">
            <div className="min-h-[150px] space-y-2.5 rounded-xl bg-transparent p-3.5">
              <div className="max-w-[85%] rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-[#2E3340] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
                {isArabic ? 'مرحبا بكم في المحامي للخدمات القانونية. كيف يمكننا مساعدتكم اليوم؟' : 'Welcome to Almahy Legal Services. How can we assist you today ?'}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-[#D7D9DE] bg-white px-2 py-2">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                className="h-9 flex-1 bg-transparent px-2 text-sm text-[#263238] outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1ebe5b]"
                aria-label={isArabic ? 'ارسال' : 'Send'}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M2.8 9.2a.75.75 0 000 1.6l5.76.64 1.58 5.26a.75.75 0 001.41.03l5.72-13.2a.75.75 0 00-.97-.99L2.8 9.2Zm8.48 4.94L10.2 10.5a.75.75 0 00-.62-.52l-4.29-.48 9.56-3.85-3.57 8.49Z" />
                </svg>
              </button>
            </div>

            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#128C7E] hover:underline"
            >
              <WhatsappIcon className="h-3.5 w-3.5" />
              {isArabic ? 'بدء المحادثة الفورية' : 'Open instant WhatsApp chat'}
            </a>
          </div>
      </div>

      <button
        type="button"
        onClick={openChat}
        aria-label={isArabic ? 'فتح دردشة واتساب' : 'Open WhatsApp chat'}
        className={`ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:bg-[#1ebe5b] ${
          open ? 'pointer-events-none scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <WhatsappIcon className="h-7 w-7" />
      </button>
    </div>
  );
}
