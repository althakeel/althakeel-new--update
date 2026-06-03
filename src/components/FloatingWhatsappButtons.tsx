'use client';

import { usePathname } from 'next/navigation';

const whatsappLinks = [
  {
    label: 'WhatsApp English Channel',
    href: 'https://whatsapp.com/channel/0029VaKLu1yAInPptlhwDS2l',
  },
  {
    label: 'WhatsApp Arabic Channel',
    href: 'https://whatsapp.com/channel/0029VaFbXEoHFxOxO8VDzS10',
  },
];

function WhatsappIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="currentColor"
    >
      <path d="M19.05 4.94A9.9 9.9 0 0 0 12.02 2C6.53 2 2.06 6.46 2.06 11.96c0 1.76.46 3.48 1.33 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.8 1.23h.01c5.49 0 9.96-4.47 9.96-9.96a9.9 9.9 0 0 0-2.92-6.97ZM12 20.19h-.01a8.26 8.26 0 0 1-4.21-1.15l-.3-.18-3.09.81.83-3.01-.2-.31a8.24 8.24 0 0 1-1.28-4.39c0-4.56 3.71-8.28 8.28-8.28a8.2 8.2 0 0 1 5.86 2.44 8.22 8.22 0 0 1 2.41 5.86c0 4.57-3.71 8.29-8.28 8.29Zm4.54-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.12-.17.25-.64.81-.79.98-.15.17-.29.19-.54.06-.25-.13-1.04-.38-1.99-1.22-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.77-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.13.17 1.75 2.68 4.25 3.76.59.25 1.06.4 1.42.51.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

export default function FloatingWhatsappButtons() {
  const pathname = usePathname();
  const isArabic = pathname?.startsWith('/ar');

  return (
    <div className={`pointer-events-none fixed top-1/2 z-50 -translate-y-1/2 ${isArabic ? 'left-0' : 'right-0'}`}>
      <div className="flex flex-col gap-3">
        {whatsappLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`pointer-events-auto group relative flex h-12 w-12 items-center justify-center bg-[#25D366] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:bg-[#1ebe5b] focus-visible:bg-[#1ebe5b] focus-visible:outline-none ${isArabic ? 'mr-auto rounded-[0_5px_5px_0] hover:translate-x-[2px] focus-visible:translate-x-[2px]' : 'ml-auto rounded-[5px_0_0_5px] hover:translate-x-[-2px] focus-visible:translate-x-[-2px]'}`}
          >
            <span className={`flex h-9 w-9 items-center justify-center bg-white/12 ${isArabic ? 'rounded-[0_4px_4px_0]' : 'rounded-[4px_0_0_4px]'}`}>
              <WhatsappIcon />
            </span>
            <span className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap bg-[#160A0A] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:flex group-hover:opacity-100 group-focus-visible:flex group-focus-visible:opacity-100 ${isArabic ? 'left-[calc(100%+12px)] rounded-[0_5px_5px_0]' : 'right-[calc(100%+12px)] rounded-[5px_0_0_5px]'}`}>
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
