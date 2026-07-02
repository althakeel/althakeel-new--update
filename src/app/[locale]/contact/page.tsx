import { translations, Locale } from "@/lib/translations";
import ContactForm from "./ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValidLoc = locale === "en" || locale === "ar";
  const lang = isValidLoc ? (locale as Locale) : "en";
  const t = translations[lang];
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const copy = {
    badge: isAr ? "تواصل معنا" : "Get in touch",
    heroTitle: isAr ? "دعنا نناقش احتياجاتك القانونية." : "Let's discuss your legal needs.",
    heroSubtitle: isAr
      ? "تواصل مع فريقنا للاستشارات ومراجعة المستندات والمسائل العاجلة. نرد عادةً خلال يوم عمل واحد."
      : "Reach our team for consultations, document reviews, and time-sensitive matters. We typically reply within one business day.",
    infoTitle: isAr ? "معلومات التواصل" : "Contact information",
    infoSubtitle: isAr
      ? "زرنا في مكتبنا بدبي أو تواصل معنا مباشرة."
      : "Visit us at our Dubai office or reach us directly.",
    mapTitle: isAr ? "موقعنا على الخريطة" : "Find us on the map",
  };

  const channels = [
    {
      label: t.address,
      lines: isAr
        ? ["برج الصقر للأعمال، الطابق الثاني", "شارع الشيخ زايد، مركز دبي المالي العالمي، دبي"]
        : ["Al Saqr Business Tower, 2nd Floor", "Sheikh Zayed Rd, DIFC, Dubai, UAE"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      ),
    },
    {
      label: t.phone,
      lines: ["+971 4264 8831", "+971 5040 96028"],
      hrefs: ["tel:+97142648831", "tel:+971504096028"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M6.5 3h3l1 4-2 .8a10 10 0 0 0 4.2 4.2l.8-2 4 1v3a2 2 0 0 1-2.3 2 16 16 0 0 1-7.7-3.6 16 16 0 0 1-3.6-7.7A2 2 0 0 1 6.5 3Z" />
        </svg>
      ),
    },
    {
      label: t.email,
      lines: ["info@almahy.com", "legal@almahy.com"],
      hrefs: ["mailto:info@almahy.com", "mailto:legal@almahy.com"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
          <path d="m5 7 7 5 7-5" />
        </svg>
      ),
    },
    {
      label: t.hours,
      lines: [t.hoursWeekdays, t.hoursWeekend],
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
  ];

  return (
    <div dir={dir} className="bg-[#160A0A] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-4 text-center sm:pt-28">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A24B]">
          {copy.badge}
        </span>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          {copy.heroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          {copy.heroSubtitle}
        </p>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm lang={lang} />
          </div>

          {/* Consolidated contact panel */}
          <aside className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-xl font-semibold text-white">{copy.infoTitle}</h2>
              <p className="mt-1.5 text-sm text-white/60">{copy.infoSubtitle}</p>

              <div className="mt-7 divide-y divide-white/10">
                {channels.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 py-5 first:pt-0">
                    <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#C9A24B]/15 text-[#C9A24B]">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                        {item.label}
                      </p>
                      <div className="mt-1.5 space-y-0.5">
                        {item.lines.map((line, i) =>
                          item.hrefs?.[i] ? (
                            <a
                              key={line}
                              href={item.hrefs[i]}
                              className="block text-sm font-medium text-white transition hover:text-[#E6C878]"
                            >
                              {line}
                            </a>
                          ) : (
                            <p key={line} className="text-sm text-white/80">
                              {line}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Map */}
      <section>
        <div className="mx-auto max-w-6xl px-6 pb-6 text-center sm:px-8">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{copy.mapTitle}</h2>
          <div className="mx-auto mt-4 h-0.5 w-16 rounded bg-[#C9A24B]" />
        </div>
        <iframe
          title={copy.mapTitle}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.684205591655!2d55.27354838885498!3d25.213870100000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f434f5fdaba03%3A0x37097f69d9d98181!2sAlmahy%20Legal%20Services!5e0!3m2!1sen!2sae!4v1771139862934!5m2!1sen!2sae"
          width="100%"
          height="420"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </section>
    </div>
  );
}
