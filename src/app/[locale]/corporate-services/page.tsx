import { Locale } from "@/lib/translations";
import Image from "next/image";

type NewsItem = {
  title: string;
  image: string;
  url?: string;
};

const officeFallbackImages = [
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=700&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=700&fit=crop",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=700&fit=crop",
];

const newsFallbackImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=700&fit=crop",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=700&fit=crop",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=700&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=700&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=700&fit=crop",
];

function getSafeImageUrl(imageUrl: string | undefined, pool: string[], preferredIndex = 0): string {
  const fallback = pool[preferredIndex % pool.length];

  if (!imageUrl) {
    return fallback;
  }

  if (imageUrl.startsWith("https://images.unsplash.com/")) {
    return imageUrl;
  }

  return fallback;
}

async function fetchLatestCorporateNews(isArabic: boolean, fallbackItems: NewsItem[]): Promise<NewsItem[]> {
  const newsApiKey = process.env.NEWS_API_KEY;

  if (!newsApiKey) {
    return fallbackItems;
  }

  const query = isArabic
    ? "تأسيس الشركات في الإمارات OR قوانين الشركات OR الاستثمار في الإمارات"
    : "UAE corporate law OR business setup UAE OR company formation UAE";

  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${isArabic ? "ar" : "en"}&sortBy=publishedAt&pageSize=6`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": newsApiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackItems;
    }

    const payload = (await response.json()) as {
      articles?: Array<{
        title?: string;
        urlToImage?: string;
        url?: string;
      }>;
    };

    const parsed = (payload.articles ?? [])
      .filter((article) => article.title)
      .slice(0, 6)
      .map((article) => ({
        title: article.title as string,
        image: article.urlToImage || "",
        url: article.url,
      }));

    return parsed.length ? parsed : fallbackItems;
  } catch {
    return fallbackItems;
  }
}

export default async function CorporateServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValidLoc = locale === "en" || locale === "ar";
  const lang = isValidLoc ? (locale as Locale) : "en";

  const isArabic = lang === "ar";

  const services = [
    {
      title: "Business Setup – Dubai Mainland, UAE Free Zones & Offshore",
      paragraphs: [
        "Setting up a business in the UAE can be simple with the right legal partner. At Almahy for Legal Services – Corporate, we support company establishment in Dubai Mainland, Free Zones, and Offshore jurisdictions.",
        "Whether you are a solo entrepreneur or a growing enterprise, we guide you through license selection, legal structure, government approvals, and final registration with a fast, transparent, and compliant process.",
      ],
      bullets: [
        "Mainland company registration under DED",
        "Free zone formation across Dubai, Abu Dhabi, Sharjah, RAK, and more",
        "Offshore company setup for international operations and asset protection",
      ],
    },
    {
      title: "Trademark Registration",
      paragraphs: [
        "Trademark registration protects your brand name, logo, slogan, or symbol through official registration with the UAE Ministry of Economy.",
        "Once registered, your mark becomes your exclusive property and is protected under UAE intellectual property laws.",
      ],
      bullets: [
        "Prevent unauthorized use or copying of your brand",
        "Gain exclusive rights across the UAE",
        "Build customer trust and brand credibility",
        "Enforce your rights legally in case of misuse",
      ],
    },
    {
      title: "Mergers and Acquisitions (M&A)",
      paragraphs: [
        "M&A refers to transactions where companies combine through merger or where one entity acquires another to expand, restructure, or strengthen market position.",
        "These deals involve complex legal, financial, and regulatory requirements. We work alongside your internal teams to protect your interests and align deal structure with business goals.",
      ],
      bullets: [
        "Legal due diligence",
        "Regulatory approvals",
        "Deal structuring and negotiations",
        "Tax and ownership risk mitigation",
      ],
    },
    {
      title: "Customs Consultancy",
      paragraphs: [
        "Customs consultancy covers legal and regulatory support for import/export operations in the UAE, including registration, documentation, tariff classification, and ongoing compliance.",
        "As a major regional trading hub, customs mistakes can lead to fines, delays, and disputes. We help importers, exporters, and logistics companies stay compliant and efficient.",
      ],
      bullets: [
        "UAE and GCC customs regulation guidance",
        "Registration with Dubai Customs and other Emirates",
        "Accurate tariff code and goods classification",
        "Clearance documentation and dispute prevention",
      ],
    },
    {
      title: "Immigration Services",
      paragraphs: [
        "Immigration services include legal support for visas, residency permits, and work authorizations for investors, business owners, employees, and families in the UAE.",
        "Our team handles end-to-end processing, from selecting the proper visa route to submission and authority follow-up.",
      ],
    },
    {
      title: "Legal Consultation Services",
      paragraphs: [
        "Legal consultation provides clear professional advice on UAE law, regulations, contracts, disputes, and compliance matters.",
        "Whether you are entering a transaction, handling a dispute, or seeking legal clarity, we deliver practical guidance for individuals and businesses.",
      ],
    },
    {
      title: "Real Estate Broker Services",
      paragraphs: [
        "Our licensed real estate brokerage service supports property buying, selling, renting, and management in the UAE with legal protection and market expertise.",
        "We ensure transactions are secure, properly documented, and fully compliant.",
      ],
    },
    {
      title: "Tax Filing and Follow-Up",
      paragraphs: [
        "We prepare and submit VAT and corporate tax filings to the Federal Tax Authority (FTA), with ongoing follow-up for compliance and clarifications.",
        "Our tax support helps businesses avoid penalties through accurate, on-time filing and proper authority coordination.",
      ],
    },
    {
      title: "Labor Services",
      paragraphs: [
        "Labor services cover employment procedures, work permits, labor contracts, and required approvals under UAE labor law.",
        "We support MOHRE processes and documentation to help employers maintain lawful workforce operations.",
      ],
    },
    {
      title: "Online Authentic Signature",
      paragraphs: [
        "We support secure online signature workflows for business and legal documentation aligned with UAE digital process requirements.",
      ],
    },
    {
      title: "Online Power of Attorney (POA)",
      paragraphs: [
        "Online POA allows you to issue legally binding powers of attorney digitally through UAE e-notarization channels.",
        "You can authorize representation for legal, property, and business matters remotely without physical notary visits.",
      ],
    },
    {
      title: "License Amendment",
      paragraphs: [
        "License amendment includes updates to trade licenses such as name change, activity additions/removals, shareholder or manager updates, legal form modification, and address updates.",
        "We coordinate documentation, authority approvals, and compliance requirements with DED and Free Zone authorities.",
      ],
      bullets: [
        "Add or remove activities",
        "Change trade name",
        "Modify shareholders or managers",
        "Change legal form (e.g., sole establishment to LLC)",
      ],
    },
    {
      title: "Memorandum of Understanding (MOU)",
      paragraphs: [
        "An MoU is a structured written understanding between parties for partnerships, joint ventures, and preliminary business relationships.",
        "We draft and review clear, legally sound MoUs aligned with UAE regulations.",
      ],
      bullets: [
        "MoU drafting and legal review",
        "Translation and notarization support",
        "Guidance on enforceability and transition to final contracts",
      ],
    },
    {
      title: "Bank Account Opening",
      paragraphs: [
        "We assist with corporate and personal bank account opening in UAE local and international banks.",
        "Our team supports document preparation, bank coordination, KYC handling, and follow-up until account activation.",
      ],
      bullets: [
        "Preparation of required documents",
        "Coordination with bank relationship teams",
        "Follow-up until account activation",
        "Advice on suitable banking options",
      ],
    },
    {
      title: "Office Space for Rent",
      paragraphs: [
        "We provide approved office space solutions for licensing and day-to-day operations across Dubai and other Emirates.",
        "Our options support new registrations, visa quotas, and Ejari-compliant requirements.",
      ],
      bullets: [
        "Shared desks",
        "Private furnished offices",
        "Flexi desks and virtual offices",
        "Ejari-compliant spaces for DED registration",
      ],
    },
    {
      title: "PRO Services",
      paragraphs: [
        "Our Public Relations Officer (PRO) services handle government processes so you can focus on operations.",
        "We manage visa applications, labor and immigration submissions, attestations, and company documentation requirements.",
      ],
      bullets: [
        "Visa processing and renewals",
        "Company formation paperwork",
        "Document attestation and translation",
        "Immigration and labor submissions",
        "License renewals and amendments",
      ],
    },
    {
      title: "Agreement Drafting and Preparation",
      paragraphs: [
        "We draft and review business agreements tailored to your legal and commercial needs, ensuring clarity and enforceability under UAE law.",
      ],
      bullets: [
        "Employment contracts",
        "Partnership agreements",
        "NDAs and confidentiality agreements",
        "Sales, lease, and service agreements",
        "Shareholder and investment agreements",
      ],
    },
    {
      title: "Golden Visa Services",
      paragraphs: [
        "Golden Visa services support long-term residency applications for investors, entrepreneurs, professionals, and other eligible categories.",
        "With 5- or 10-year validity and strong residency benefits, we guide eligibility checks, document preparation, submission, and approvals.",
      ],
      bullets: [
        "Eligibility assessment",
        "Document preparation",
        "Application submission",
        "Follow-up and final approvals",
      ],
    },
    {
      title: "Ejari Registration",
      paragraphs: [
        "Ejari is a mandatory Dubai Land Department tenancy registration process required for visas, DEWA, licensing, and other services.",
        "We provide fast registration, renewal, and cancellation support for residential and commercial tenancy contracts.",
      ],
      bullets: [
        "Residential and commercial tenancy registration",
        "Document verification",
        "Ejari certificates for license issuance and renewal",
      ],
    },
  ];

  const officePackages = [
    {
      name: "Virtual Office",
      price: "AED 4,000",
      subtitle: "Monthly • 1-Y Contract",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=700&fit=crop",
    },
    {
      name: "Shared Office",
      price: "AED 6,000",
      subtitle: "Monthly • 1-Y Contract",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=700&fit=crop",
    },
    {
      name: "Private Office",
      price: "AED 10,000",
      subtitle: "Monthly • 1-Y Contract",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=700&fit=crop",
    },
  ];

  const officeInclusions = [
    { en: "Reception services", ar: "خدمات الاستقبال", virtual: true, shared: true, private: true },
    { en: "Telephone line", ar: "خط الهاتف", virtual: true, shared: true, private: true },
    { en: "High-speed internet", ar: "إنترنت عالي السرعة", virtual: true, shared: true, private: true },
    { en: "Pantry/Kitchen use", ar: "استخدام المطبخ/البوفيه", virtual: true, shared: true, private: true },
    { en: "Cleaning services", ar: "خدمات التنظيف", virtual: true, shared: true, private: true },
    { en: "Meeting room access", ar: "غرفة الاجتماعات", virtual: true, shared: true, private: true },
    { en: "Ejari registration", ar: "تسجيل إيجاري", virtual: true, shared: true, private: true },
    { en: "Labor services", ar: "خدمات العمالة", virtual: false, shared: true, private: true },
    { en: "License registration", ar: "تسجيل الرخصة", virtual: false, shared: true, private: true },
    { en: "Immigration services", ar: "خدمات الهجرة", virtual: false, shared: true, private: true },
    { en: "Tax filing", ar: "تقديم الإقرارات الضريبية", virtual: false, shared: true, private: true },
    { en: "Accounting", ar: "المحاسبة", virtual: false, shared: false, private: true },
    { en: "Tax consultancy", ar: "استشارات ضريبية", virtual: false, shared: false, private: true },
    { en: "VAT registration", ar: "تسجيل ضريبة القيمة المضافة", virtual: false, shared: false, private: true },
    { en: "Collection services", ar: "خدمات التحصيل", virtual: false, shared: false, private: true },
    { en: "Trademark registration", ar: "تسجيل العلامات التجارية", virtual: false, shared: false, private: true },
    { en: "Notary services", ar: "خدمات التوثيق", virtual: false, shared: false, private: true },
    { en: "Bank account opening", ar: "فتح حسابات بنكية", virtual: false, shared: false, private: true },
    { en: "Memorandum of understanding", ar: "مذكرة تفاهم", virtual: false, shared: false, private: true },
  ];

  const fallbackNews: NewsItem[] = isArabic
    ? [
        {
          title: "مستجدات في قوانين تأسيس الشركات والامتثال المؤسسي في الإمارات",
          image: "",
          url: "https://u.ae/ar-ae/information-and-services/business",
        },
        {
          title: "تطورات تنظيمية تؤثر على التراخيص والتوسع التجاري للشركات",
          image: "",
          url: "https://u.ae/ar-ae/information-and-services/business",
        },
        {
          title: "آخر التحديثات حول الهجرة الاستثمارية وتأشيرات رواد الأعمال",
          image: "",
          url: "https://u.ae/ar-ae/information-and-services/visa-and-emirates-id",
        },
      ]
    : [
        {
          title: "Latest UAE corporate law updates for company formation and compliance",
          image: "",
          url: "https://u.ae/en/information-and-services/business",
        },
        {
          title: "Regulatory developments impacting business licensing and expansion",
          image: "",
          url: "https://u.ae/en/information-and-services/business",
        },
        {
          title: "New insights on investor immigration and entrepreneur visa pathways",
          image: "",
          url: "https://u.ae/en/information-and-services/visa-and-emirates-id",
        },
      ];

  const corporateNews = await fetchLatestCorporateNews(isArabic, fallbackNews);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#171d2a]" />
        <div className="absolute -top-20 -left-16 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
          <p className="inline-flex border border-white/20 rounded-full px-4 py-2 text-sm text-slate-200 mb-5">
            {isArabic ? "الماحي للخدمات القانونية" : "ALMAHY FOR LEGAL SERVICES"}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
            {isArabic ? "خدمات الشركات" : "Corporate Services"}
          </h1>
          <p className="text-slate-200 text-base md:text-xl max-w-4xl leading-relaxed mb-7">
            {isArabic
              ? "خدمات قانونية متكاملة لتأسيس الشركات، التراخيص، الهجرة، الضرائب، العقود، وخدمات الجهات الحكومية في دولة الإمارات."
              : "Comprehensive UAE corporate legal support for business setup, licensing, immigration, tax compliance, contract drafting, and government liaison services."}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/971504096028?text=Hello%2C%20I%20need%20corporate%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-white hover:bg-white/10 transition-colors"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="rounded-3xl border border-amber-100/20 bg-gradient-to-br from-[#160A0A] via-[#160A0A] to-[#160A0A] p-5 md:p-7">
          <div className="mb-5">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-200 mb-2">
              {isArabic ? "حلول المكاتب" : "Office Solutions"}
            </h2>
            <p className="text-slate-300">
              {isArabic
                ? "تصميم مستقل لباقات المكاتب لتوضيح الخيارات المناسبة لنشاطك."
                : "A separate design block for office plans to clearly compare options for your setup."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
          {officePackages.map((plan, index) => (
            <div
              key={plan.name}
              className="rounded-2xl border border-amber-200/25 bg-black/20 backdrop-blur-sm p-6 text-center"
            >
              <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 mb-4">
                <Image
                  src={getSafeImageUrl(plan.image, officeFallbackImages, index)}
                  alt={plan.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              </div>
              <h3 className="text-2xl font-bold text-amber-300 mb-2">{plan.name}</h3>
              <p className="text-3xl font-extrabold text-white mb-1">{plan.price}</p>
              <p className="text-slate-300 text-sm">{plan.subtitle}</p>
            </div>
          ))}
          </div>

          <div className="mt-7 rounded-2xl border border-amber-100/20 bg-slate-950/50 p-3 md:p-4">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-white/[0.04]">
                    <th className="border border-white/15 px-4 py-4 text-left text-slate-100 font-semibold">Inclusions</th>
                    <th className="border border-white/15 px-4 py-4 text-center text-amber-200 font-semibold">
                      <div>VIRTUAL OFFICE</div>
                      <div className="text-slate-100 font-bold text-base mt-1">AED 4,000</div>
                      <div className="text-xs text-slate-300">Monthly • 1-Y Contract</div>
                    </th>
                    <th className="border border-white/15 px-4 py-4 text-center text-amber-200 font-semibold">
                      <div>SHARED OFFICE</div>
                      <div className="text-slate-100 font-bold text-base mt-1">AED 6,000</div>
                      <div className="text-xs text-slate-300">Monthly • 1-Y Contract</div>
                    </th>
                    <th className="border border-white/15 px-4 py-4 text-center text-amber-200 font-semibold">
                      <div>PRIVATE OFFICE</div>
                      <div className="text-slate-100 font-bold text-base mt-1">AED 10,000</div>
                      <div className="text-xs text-slate-300">Monthly • 1-Y Contract</div>
                    </th>
                    <th className="border border-white/15 px-4 py-4 text-right text-slate-100 font-semibold">المحتويات</th>
                  </tr>
                </thead>
                <tbody>
                  {officeInclusions.map((row) => (
                    <tr key={row.en} className="odd:bg-white/[0.02] even:bg-transparent">
                      <td className="border border-white/10 px-4 py-2.5 text-slate-100">{row.en}</td>
                      <td className="border border-white/10 px-4 py-2.5 text-center text-lg font-bold text-slate-100">{row.virtual ? "✓" : "×"}</td>
                      <td className="border border-white/10 px-4 py-2.5 text-center text-lg font-bold text-slate-100">{row.shared ? "✓" : "×"}</td>
                      <td className="border border-white/10 px-4 py-2.5 text-center text-lg font-bold text-slate-100">{row.private ? "✓" : "×"}</td>
                      <td className="border border-white/10 px-4 py-2.5 text-right text-slate-100">{row.ar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-slate-200">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-semibold text-amber-200 leading-snug">
                  {service.title}
                </h2>
              </div>

              <div className="space-y-3">
                {service.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-slate-200 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {service.bullets ? (
                <ul className="mt-4 space-y-2">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="text-slate-300 flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-200 mb-2">
            {isArabic ? "أخبار الشركات" : "Corporate News"}
          </h2>
          <p className="text-slate-300">
            {isArabic
              ? "أحدث المستجدات ذات الصلة بتأسيس الشركات والامتثال والبيئة التنظيمية في الإمارات."
              : "Latest updates related to company formation, compliance, and the business regulatory landscape in the UAE."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {corporateNews.map((news, index) => (
            <article
              key={`${news.title}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              {news.image ? (
                <div className="relative h-36 rounded-xl overflow-hidden border border-white/10 mb-4">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <p className="text-slate-100 font-semibold leading-snug mb-4 line-clamp-3">{news.title}</p>
              {news.url ? (
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-semibold text-amber-300 hover:text-amber-200"
                >
                  {isArabic ? "اقرأ المزيد" : "Read more"}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
