"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { translations, Locale } from "@/lib/translations";

import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import ServicesSection from "@/components/ServicesSection";
import GoogleReviews from "@/components/GoogleReviews";
import Stats from "@/components/Stats";
import ClientLogosMarquee from "@/components/ClientLogosMarquee";
import AboutSectionWithVideo from "@/components/AboutSectionWithVideo";

export default function Home() {
  const params = useParams();
  const locale = params?.locale as string;

  const lang: Locale = locale === "ar" ? "ar" : "en";
  const isRTL = lang === "ar";
  const t = translations[lang];

  /* ---------------- Hero Headlines ---------------- */

  const heroHeadlines =
    lang === "ar"
      ? [
          ["حماية حقوقكم", "بدعم قانوني", "عملي وفعّال."],
          ["عدالتك، مهمتنا", "إرشاد قانوني خبير", "في كل خطوة."],
          ["شركة محاماة موثوقة", "38 عامًا من التميز", "في الخدمات القانونية."],
          ["نتائج تهمك", "مكرسون لقضيتك", "بكل نزاهة."],
        ]
      : [
          ["Protecting Your Rights", "With Practical Legal", "Support."],
          ["Your Justice, Our Mission", "Expert Legal Guidance", "Every Step."],
          ["Trusted Law Firm", "38 Years of Excellence", "In Legal Services."],
          ["Results That Matter", "Dedicated to Your Case", "With Integrity."],
        ];


  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout | undefined;
    let headlineTimer: NodeJS.Timeout | undefined;
    if (fade) {
      // After 3400ms, start fade out
      fadeOutTimer = setTimeout(() => setFade(false), 3400);
    } else {
      // After 600ms fade out, change headline and fade in
      headlineTimer = setTimeout(() => {
        setHeadlineIdx((prev) => (prev + 1) % heroHeadlines.length);
        setFade(true);
      }, 600);
    }
    return () => {
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
      if (headlineTimer) clearTimeout(headlineTimer);
    };
  }, [fade, headlineIdx]);

  const currentHeadline = heroHeadlines[headlineIdx].join('\n');

  /* ---------------- 38 Years Counter ---------------- */

  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const end = 38;

    const interval = setInterval(() => {
      i++;
      setCount(i);

      if (i === end) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const desktopHeroImage = isRTL ? "/assets/banner/DB1B.webp" : "/assets/banner/DB1.webp";
  const mobileHeroImage = "/assets/banner/MB1.webp";

  /* ---------------- Component ---------------- */

  return (
    <div dir={isRTL ? "rtl" : "ltr"} lang={lang} className="w-full">

      {/* HERO SECTION */}

      <section
        className="relative w-full h-[65vh] min-h-[750px] md:min-h-[600px] max-h-[1200px] flex items-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: `url("${mobileHeroImage}")` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{ backgroundImage: `url("${desktopHeroImage}")` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/0"></div>

        {/* Right Bottom Badge - Section Level */}
        <div className={`hidden xl:flex absolute bottom-14 ${isRTL ? 'left-10 2xl:left-20' : 'right-10 2xl:right-20'} flex-col items-center select-none gap-1 z-20`}>
          <span className="text-8xl font-bold text-white leading-none" style={{ fontFamily: '"Mizra", "Times New Roman", serif' }}>{count}</span>
          <span className="text-lg text-white leading-none font-medium" style={{ fontFamily: '"Mizra", "Times New Roman", serif' }}>{isRTL ? "سنة" : "Years"}</span>
          <span className="text-base text-white/80 font-medium text-center" style={{ fontFamily: '"Mizra", "Times New Roman", serif' }}>
            {isRTL ? "الخدمات القانونية" : "Legal Services"}
          </span>
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-[1250px] mx-auto flex items-center px-4 md:px-8 w-full">

          {/* Text */}

          <div className="flex-1 flex flex-col justify-center items-start text-left w-full" style={{gap: '5px', height: '260px'}}>

            <span className={`uppercase text-[#DE3B34] text-xs font-semibold mb-2 tracking-widest${isRTL ? ' mb-4' : ''}`} style={{fontFamily: "Montserrat, sans-serif"}}>
              {isRTL ? "دَع المحكمة لنا" : "Leave Court To Us"}
            </span>

            <h1
              className={`text-3xl md:text-5xl font-bold text-white mt-4 whitespace-pre-line max-w-4xl flex items-center transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}
              style={{ width: "100%", height: "220px", fontFamily: "Georgia, serif", textAlign: "left" }}
            >
              {currentHeadline}
            </h1>

            <div className="flex flex-row items-center mb-2 md:mb-3 w-full md:w-1/2">
              <div className="w-1 h-8 md:h-12 bg-[#DE3B34] mr-2 md:mr-4" />
              <p className="text-white/90 text-base xs:text-lg md:text-xl font-normal w-full text-left" style={{textShadow: '0 1px 8px rgba(0,0,0,0.35)', fontFamily: "Arial, sans-serif"}}>
                {isRTL
                  ? "نحن منارة خبرتك القانونية، حيث تتحول القضايا الصعبة إلى انتصارات. واجه التحديات القانونية بثقة بينما نتولى نحن التعقيدات."
                  : "We stand as your beacon of legal mastery, where daunting issues are transformed into victories. Navigate legal challenges with confidence while we handle the complexities."
                }
              </p>
            </div>

            <Link
              href={`/${lang}/services`}
              className={`inline-flex items-center gap-2 font-bold py-2.5 md:py-3 px-4 sm:px-6 md:px-8 rounded-2xl shadow-lg bg-[#DE3B34] text-white text-base md:text-lg tracking-wide group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#CECDCB]/40 border border-[#CECDCB] hover:bg-[#c73731] hover:text-white hover:scale-105 hover:shadow-2xl w-fit justify-center`}
              style={{ minWidth: 0, letterSpacing: '0.04em', boxShadow: '0 4px 24px 0 rgba(222, 59, 52, 0.15)', fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="text-xl font-extrabold transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">+</span>
              <span className="transition-colors duration-300">{isRTL ? "اعرف المزيد" : "Learn More"}</span>
            </Link>

          </div>

          </div>
        </div>
      </section>

      {/* Other Sections */}

      <ClientLogosMarquee locale={lang} />

      <AboutSectionWithVideo
        t={{
          aboutTestimonial: t.aboutTestimonial,
          aboutUsLabel: t.aboutUsLabel,
          aboutHeadline: t.aboutHeadline,
          aboutDescription: t.aboutDescription,
        }}
        isRTL={isRTL}
      />

      <ServicesSection locale={lang} />

      <Stats locale={lang} />

      <GoogleReviews locale={lang} />

      <FAQ locale={lang} />

      <CTA locale={lang} />

    </div>
  );
} 