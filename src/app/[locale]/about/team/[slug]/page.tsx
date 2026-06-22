import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Locale } from "@/lib/translations";
import { getAllTeamSlugs, getTeamMemberBySlug } from "@/lib/teamMembers";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllTeamSlugs();
  return ["en", "ar"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) return { title: "Team Member | Almahy" };

  const isArabic = locale === "ar";
  return {
    title: `${isArabic ? member.nameAr : member.nameEn} | Almahy Legal Services`,
    description: isArabic ? member.casesDetailAr : member.casesDetailEn,
  };
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-600 bg-gray-800 text-gray-300 transition hover:border-[#DE3B34] hover:bg-[#DE3B34] hover:text-white"
    >
      {children}
    </a>
  );
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang: Locale = locale === "ar" ? "ar" : "en";
  const isArabic = lang === "ar";
  const member = getTeamMemberBySlug(slug);

  if (!member) notFound();

  const name = isArabic ? member.nameAr : member.nameEn;
  const position = isArabic ? member.positionAr : member.positionEn;
  const casesHandled = isArabic ? member.casesHandledDisplayAr : member.casesHandledDisplayEn;
  const casesInProgress = isArabic ? member.casesInProgressAr : member.casesInProgressEn;
  const casesDetail = isArabic ? member.casesDetailAr : member.casesDetailEn;
  const practiceAreas = isArabic ? member.practiceAreasAr : member.practiceAreasEn;
  const highlights = isArabic ? member.highlightsAr : member.highlightsEn;
  const overview = isArabic ? member.overviewAr : member.overviewEn;
  const credentials = isArabic ? member.credentialsAr : member.credentialsEn;
  const phoneHref = member.phone.replace(/[^\d+]/g, "");
  const whatsappHref = `https://wa.me/${phoneHref.replace(/^\+/, "")}?text=${encodeURIComponent(
    isArabic ? `مرحباً، أرغب في التواصل مع ${member.nameAr}.` : `Hello, I would like to connect with ${member.nameEn}.`,
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4 md:px-8" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl">
        {/* Header — same pattern as Services / Contact pages */}
        <div className="mb-12 pt-8 text-center">
          <p className="mb-4 text-sm text-gray-400">
            <Link href={`/${lang}`} className="transition hover:text-white">
              {isArabic ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${lang}/about`} className="transition hover:text-white">
              {isArabic ? "من نحن" : "About us"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">{name}</span>
          </p>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#DE3B34" }}>
            {isArabic ? "فريقنا" : "Our Team"}
          </p>
          <h1 className={`mb-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-5xl ${isArabic ? "" : "uppercase"}`}>
            {name}
          </h1>
          <p className={`text-sm font-semibold tracking-[0.14em] text-gray-300 ${isArabic ? "" : "uppercase"}`}>{position}</p>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded" style={{ backgroundColor: "#DE3B34" }} />
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#DE3B34" }} />
              <div className="h-1 w-12 rounded" style={{ backgroundColor: "#DE3B34" }} />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
          {/* Sidebar card — same style as Services page cards */}
          <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
            <img src={member.photo} alt={name} className="h-[380px] w-full object-cover object-top" />
            <div className="border-t border-gray-700 px-5 py-5">
              <div className="space-y-2.5 text-sm">
                <a href={`tel:${phoneHref}`} className="flex items-center gap-2 text-gray-300 transition hover:text-[#DE3B34]">
                  <span>📞</span>
                  <span>{member.phone}</span>
                </a>
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-gray-300 transition hover:text-[#DE3B34]">
                  <span>✉️</span>
                  <span>{member.email}</span>
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <SocialIcon href={`mailto:${member.email}`} label="Email">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v10H4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={`tel:${phoneHref}`} label="Phone">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 4h2l1.5 5-2 1.2a11 11 0 0 0 5.3 5.3L14.5 14l5 1.5v2A2.5 2.5 0 0 1 17 20C10.4 20 4 13.6 4 7a2.5 2.5 0 0 1 2.5-3Z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={whatsappHref} label="WhatsApp">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.09.61 4.07 1.76 5.77L2 22l4.45-1.17a9.9 9.9 0 0 0 5.59 1.71h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.87 14.13c-.25.7-1.45 1.34-2 1.42-.5.08-1.16.12-1.87-.12-.43-.15-1-.48-1.73-.94-3.04-2.01-5.02-4.98-5.17-5.21-.15-.23-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41 0 .59.01.19.01.44-.07.69.53.25.6.85 2.08.93 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.3.32-.13.63.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.48.13.66-.08.18-.2.76-.89.97-1.2.2-.3.41-.25.69-.15.28.1 1.77.83 2.07.98.3.15.5.23.57.35.08.13.08.75-.17 1.45Z" />
                  </svg>
                </SocialIcon>
                {member.linkedin ? (
                  <SocialIcon href={member.linkedin} label="LinkedIn">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5ZM5.2 8.47H8.7V19.5H5.2ZM10.44 8.47H13.86V9.9h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47V19.5h-3.5v-5.34c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V19.5h-3.5Z" />
                    </svg>
                  </SocialIcon>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#DE3B34" }}>
                {isArabic ? "سجل القضايا" : "Case Record"}
              </p>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
                <div>
                  <p className="text-sm font-medium text-gray-400">{isArabic ? "القضايا التي تولاها" : "Cases Handled"}</p>
                  <p className="mt-1 text-5xl font-black leading-none text-white">{casesHandled}</p>
                </div>
                <div className="rounded-xl border border-[#DE3B34]/30 bg-[#DE3B34]/10 px-4 py-3 sm:flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#DE3B34" }}>
                    {isArabic ? "قضايا قيد الإجراء" : "Cases In Process"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-200">{casesInProgress}</p>
                </div>
              </div>
              <p className="mt-6 text-base leading-8 text-gray-300">{casesDetail}</p>
            </section>

            <section className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:p-8">
              <h2 className="text-lg font-bold text-white">{isArabic ? "مجالات العمل" : "Practice Areas"}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {practiceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:p-8">
              <h2 className="text-lg font-bold text-white">{isArabic ? "المسؤوليات الرئيسية" : "Key Responsibilities"}</h2>
              <ul className="mt-4 space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-gray-300 md:text-base">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#DE3B34" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {credentials?.length ? (
              <section className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:p-8">
                <h2 className="text-lg font-bold text-white">{isArabic ? "التعليم والشهادات" : "Education & Certifications"}</h2>
                <div className="mt-5 space-y-4">
                  {credentials.map((item) => (
                    <div key={`${item.institution}-${item.certificate}`} className="rounded-xl border border-gray-700 bg-gray-800/70 p-4">
                      <p className="text-base font-bold text-white">{item.institution}</p>
                      <p className="mt-2 text-sm leading-7 text-gray-300 md:text-base">{item.certificate}</p>
                      {item.date ? <p className="mt-2 text-sm font-semibold text-[#DE3B34]">{item.date}</p> : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:p-8">
              <h2 className="text-lg font-bold text-white">{isArabic ? "نبذة مهنية" : "Professional Overview"}</h2>
              <div className="mt-4 space-y-4">
                {overview.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <Link
              href={`/${lang}/about`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3 text-sm font-bold text-white transition hover:border-[#DE3B34] hover:text-[#DE3B34]"
            >
              {isArabic ? "← العودة إلى الفريق" : "← Back to team"}
            </Link>
          </div>
        </div>

        {/* CTA — same as About page bottom section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-12 text-center shadow-2xl border border-gray-700">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {isArabic ? "هل تحتاج إلى استشارة؟" : "Need a Consultation?"}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            {isArabic
              ? "تواصل معنا اليوم للحصول على استشارة مجانية."
              : "Contact us today for a free consultation."}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="inline-block rounded-full px-10 py-4 text-lg font-bold text-gray-900 shadow-lg transition hover:shadow-xl"
            style={{ backgroundColor: "#DE3B34" }}
          >
            {isArabic ? "تواصل معنا" : "CONNECT WITH US!"}
          </Link>
        </div>
      </div>
    </div>
  );
}
