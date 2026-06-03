import { Locale } from "@/lib/translations";
import Image from "next/image";

const palette = {
  primary: "#DE3B34",
  secondary: "#FFB6B6",
  accent: "#CECDCB",
  dark: "#160A0A",
};

type NewsItem = {
  title: string;
  image: string;
  url?: string;
};

const defaultImage = "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=700&fit=crop";

function getSafeImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    return defaultImage;
  }

  if (imageUrl.startsWith("https://images.unsplash.com/")) {
    return imageUrl;
  }

  return defaultImage;
}

async function fetchLatestLegalNews(isArabic: boolean, fallbackItems: NewsItem[]): Promise<NewsItem[]> {
  const newsApiKey = process.env.NEWS_API_KEY;

  if (!newsApiKey) {
    return fallbackItems;
  }

  const query = isArabic
    ? "القانون الإماراتي OR التحكيم التجاري OR النزاعات التجارية"
    : "UAE legal news OR commercial arbitration OR corporate disputes";

  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${isArabic ? "ar" : "en"}&sortBy=publishedAt&pageSize=10`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": newsApiKey,
      },
      next: { revalidate: 21600 },
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
      .filter((article) => article.title && article.urlToImage)
      .slice(0, 10)
      .map((article) => ({
        title: article.title as string,
        image: getSafeImageUrl(article.urlToImage),
        url: article.url,
      }));

    return parsed.length ? parsed : fallbackItems;
  } catch {
    return fallbackItems;
  }
}

export default async function LegalServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValidLoc = locale === "en" || locale === "ar";
  const lang = isValidLoc ? (locale as Locale) : "en";

  const isArabic = lang === "ar";

  const legalAreas = [
    {
      title: "Arbitration, Banking & Tax",
      paragraphs: [
        "Arbitration is a preferred method of dispute resolution in the UAE, especially in commercial and cross-border matters. Our firm represents clients in proceedings governed by local and international rules, including DIAC, DIFC-LCIA, ICC, and UNCITRAL.",
        "We assist with arbitration clauses, statements of claim and defense, arbitrator appointments, and enforcement or challenge of arbitral awards before UAE courts. Our lawyers are experienced in construction, banking, real estate, energy, and shareholder disputes.",
        "Our banking and tax practice supports financial institutions, lenders, borrowers, fintech startups, and corporates with loan agreements, guarantees, Islamic finance structures (Murabaha, Ijara, Sukuk), syndicated lending, and cross-border finance. We also advise on UAE corporate tax planning, international tax compliance, economic substance regulations, and VAT strategy.",
      ],
    },
    {
      title: "Bankruptcy & Insolvency",
      paragraphs: [
        "Facing financial difficulties can be challenging for both individuals and businesses. We guide clients through insolvency and bankruptcy procedures under UAE Federal Decree-Law No. (9) of 2016 and subsequent updates.",
        "For companies, we provide restructuring strategies, debt settlement support, and court-supervised liquidation assistance. For creditors, we pursue claims, represent interests in committees, and safeguard asset recovery with practical, outcome-focused legal support.",
      ],
    },
    {
      title: "Civil",
      paragraphs: [
        "Civil law covers disputes involving contracts, property, financial compensation, obligations, and tort liability. We represent clients before federal and local UAE courts with careful preparation, timely filings, and strategic negotiation.",
        "Our team handles both individual and complex corporate civil disputes with detailed legal analysis and persuasive advocacy to protect rights and secure favorable outcomes.",
      ],
    },
    {
      title: "Competition",
      paragraphs: [
        "As the UAE continues opening to global markets, compliance with competition law is essential. We advise on UAE Competition Law (Federal Law No. 4 of 2012), merger control regulations, and anti-competitive risk.",
        "Our services include agreement reviews, merger clearance support, defense in cartel and dominance investigations, and pricing policy guidance to reduce regulatory exposure while preserving market strength.",
      ],
    },
    {
      title: "Criminal",
      paragraphs: [
        "Criminal allegations in the UAE can have serious legal and reputational impact. Our criminal law team provides strategic defense for individuals and companies in cases including fraud, embezzlement, cybercrime, drug offenses, defamation, breach of trust, and violent offenses.",
        "We represent clients from police investigations and prosecution through trial and appeal, and also assist with bail applications and criminal record clearance under UAE Penal Code and Criminal Procedure Law.",
      ],
    },
    {
      title: "Real Estate",
      paragraphs: [
        "With rapid growth in the UAE property market, legal guidance is critical. We advise on residential and commercial transactions, leasing, mortgage structuring, off-plan acquisitions, registration, due diligence, escrow compliance, and landlord-tenant disputes.",
        "Whether you are a developer, investor, homeowner, or tenant, we provide practical legal support across freehold and leasehold areas in the UAE.",
      ],
    },
    {
      title: "Shipping, Maritime & Aviation",
      paragraphs: [
        "Our transport law practice covers maritime and aviation operations from start to finish. We advise shipping companies, logistics providers, freight forwarders, and airlines on compliance, carrier liabilities, bills of lading, charter parties, cargo claims, vessel arrest, and port disputes.",
        "We also support licensing and aircraft registration matters, drawing on UAE maritime law, international conventions, and civil aviation regulations.",
      ],
    },
    {
      title: "Family Law",
      paragraphs: [
        "Family matters are often emotionally and legally complex in a multicultural society. We represent clients in divorce (Muslim and non-Muslim), financial settlements, custody and visitation, guardianship, and inheritance matters.",
        "Our team appears before Sharia courts, civil family courts, and the DIFC family tribunal, with support on pre-nuptial and post-nuptial arrangements and a child-focused, culturally sensitive approach.",
      ],
    },
    {
      title: "Insurance Law",
      paragraphs: [
        "We represent insurers, reinsurers, policyholders, and brokers in disputes concerning life, health, property, motor, liability, and marine insurance.",
        "Our services include claim assessment, policy drafting and interpretation, regulatory compliance, and litigation, including guidance on Central Bank and UAE insurance regulatory frameworks.",
      ],
    },
    {
      title: "Intellectual Property Services",
      paragraphs: [
        "In an innovation-driven economy, IP is a core business asset. We provide protection and enforcement for trademarks, patents, copyrights, trade secrets, and industrial designs.",
        "Our support includes UAE and GCC registrations, licensing, portfolio management, cease-and-desist actions, infringement litigation, and anti-counterfeiting measures before the Ministry of Economy, customs authorities, and courts.",
      ],
    },
    {
      title: "Labor Services",
      paragraphs: [
        "Employment relations in the UAE are governed by detailed regulations, including Federal Decree-Law No. 33 of 2021. We advise employers and employees on compliant contracts, HR policies, internal regulations, and workplace investigations.",
        "We represent clients in termination and wage disputes, labor ban matters, MOHRE proceedings, and labor court cases, with regular updates on Emiratisation and end-of-service reforms.",
      ],
    },
    {
      title: "Personal Injury & Tort",
      paragraphs: [
        "When injury arises from negligence, timely legal action is essential. We pursue compensation for personal injury, medical malpractice, traffic accidents, workplace harm, product liability, and related damages.",
        "We also defend parties facing tort claims and help resolve liability disputes under UAE civil law through negotiation and litigation.",
      ],
    },
    {
      title: "Wills, Trust & Probate Services",
      paragraphs: [
        "We assist UAE residents and expatriates with will drafting under UAE law and the DIFC Wills and Probate Registry, including Sharia-compliant succession planning and guardianship arrangements.",
        "Our probate services include court filings, executor representation, and structured asset distribution to protect family interests and reduce future legal complications.",
      ],
    },
    {
      title: "Corporate & Commercial",
      paragraphs: [
        "We advise on company formations, shareholder arrangements, commercial contracts, director duties, and day-to-day corporate governance for businesses in the UAE.",
        "Our team supports acquisitions, restructurings, exits, and dispute prevention so clients can operate with confidence across onshore and free zone structures.",
      ],
    },
    {
      title: "Licensing & Regulatory",
      paragraphs: [
        "We help clients navigate licensing, permits, renewals, and government approvals across mainland, free zone, and sector-specific regulatory frameworks.",
        "Our regulatory support includes compliance reviews, authority filings, and practical guidance to reduce risk and keep operations moving smoothly.",
      ],
    },
  ];

  const areaImages: Record<string, string> = {
    "Arbitration, Banking & Tax": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
    "Bankruptcy & Insolvency": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=700&fit=crop",
    Civil: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=700&fit=crop",
    Competition: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
    Criminal: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=700&fit=crop",
    "Real Estate": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&h=700&fit=crop",
    "Shipping, Maritime & Aviation": "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&h=700&fit=crop",
    "Family Law": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=700&fit=crop",
    "Insurance Law": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=700&fit=crop",
    "Intellectual Property Services": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=700&fit=crop",
    "Labor Services": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
    "Personal Injury & Tort": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=700&fit=crop",
    "Wills, Trust & Probate Services": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=700&fit=crop",
  };

  const fallbackNews: NewsItem[] = isArabic
    ? [
        {
          title: "تحديثات قانونية في الإمارات حول التحكيم التجاري وتسوية المنازعات",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
          url: "https://u.ae/ar-ae/information-and-services/justice-safety-and-the-law",
        },
        {
          title: "أحدث المستجدات التنظيمية في الحوكمة والامتثال للشركات",
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=700&fit=crop",
          url: "https://u.ae/ar-ae/information-and-services/business",
        },
        {
          title: "تطورات في قضايا العمل والأسرة والعقود المدنية في دولة الإمارات",
          image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=700&fit=crop",
          url: "https://u.ae/ar-ae/information-and-services/justice-safety-and-the-law",
        },
        {
          title: "تحديثات ضريبية وتنظيمية للشركات في الإمارات",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
          url: "https://u.ae/ar-ae/information-and-services/business/taxation",
        },
        {
          title: "قرارات قضائية جديدة وملاحظات قانونية مهمة للمنشآت",
          image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=700&fit=crop",
          url: "https://u.ae/ar-ae/information-and-services/justice-safety-and-the-law",
        },
      ]
    : [
        {
          title: "UAE legal updates on commercial arbitration and dispute resolution",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/justice-safety-and-the-law",
        },
        {
          title: "Recent regulatory developments in corporate compliance and governance",
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/business",
        },
        {
          title: "Latest UAE insights on labor, family, and civil legal matters",
          image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/justice-safety-and-the-law",
        },
        {
          title: "Tax and VAT compliance updates for UAE businesses",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/business/taxation",
        },
        {
          title: "Recent UAE court decisions and practical legal guidance",
          image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/justice-safety-and-the-law",
        },
        {
          title: "Corporate governance and licensing updates for UAE companies",
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/business",
        },
        {
          title: "Compliance alerts for free zones, mainland companies, and startups",
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/business",
        },
        {
          title: "Employment law and workplace compliance developments in the UAE",
          image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/jobs/employment-law",
        },
        {
          title: "Commercial dispute resolution and arbitration practice updates",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/justice-safety-and-the-law",
        },
        {
          title: "Corporate tax, VAT, and audit compliance reminders for UAE businesses",
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=700&fit=crop",
          url: "https://u.ae/en/information-and-services/business/taxation",
        },
      ];

  const legalNews = await fetchLatestLegalNews(isArabic, fallbackNews);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#160A0A]" />
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-20" style={{ backgroundColor: palette.accent }} />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium mb-6">
                {isArabic ? "الخدمات القانونية" : "Legal Services"}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
                {isArabic ? "الخدمات القانونية في الماحي" : "ALMAHY FOR LEGAL SERVICES"}
              </h1>
              <p className="max-w-2xl text-base md:text-lg text-slate-200 leading-relaxed">
                {isArabic
                  ? "حلول قانونية شاملة في التحكيم، المصارف، الضرائب، القضايا المدنية والجنائية، العقارات، الأحوال الشخصية، العمل، والتقاضي أمام المحاكم والجهات المختصة في دولة الإمارات."
                  : "Comprehensive legal support across arbitration, banking and tax, civil and criminal litigation, real estate, family law, labor, insurance, intellectual property, and cross-border matters in the UAE."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/971504096028?text=Hello%2C%20I%20need%20legal%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-black transition-transform hover:scale-105"
                  style={{ backgroundColor: palette.secondary }}
                >
                  {isArabic ? "احجز استشارة" : "Book Consultation"}
                </a>
                <a
                  href="#legal-news"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {isArabic ? "آخر الأخبار" : "Latest News"}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                <Image
                  src={areaImages["Arbitration, Banking & Tax"]}
                  alt="Legal advisory"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm uppercase tracking-wider text-slate-200 mb-1">
                    {isArabic ? "خبرة متعددة التخصصات" : "Multi-disciplinary expertise"}
                  </p>
                  <p className="text-xl font-semibold" style={{ color: palette.primary }}>
                    {isArabic ? "التحكيم والمنازعات التجارية" : "Arbitration & Commercial Disputes"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-16 space-y-6">
        {legalAreas.map((area, index) => (
          <article
            key={area.title}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] overflow-hidden"
          >
            <div className={`grid md:grid-cols-5 ${index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative md:col-span-2 h-56 md:h-full min-h-56">
                <Image
                  src={getSafeImageUrl(areaImages[area.title])}
                  alt={`${area.title} legal services`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-transparent" />
              </div>

              <div className="md:col-span-3 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-slate-200">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl font-semibold" style={{ color: palette.primary }}>
                    {area.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {area.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-slate-200 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section id="legal-news" className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-[#160A0A] p-6 md:p-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: palette.primary }}>
                {isArabic ? "أحدث الأخبار القانونية" : "Latest Legal News"}
              </h2>
              <p className="text-slate-300">
                {isArabic
                  ? "آخر المستجدات القانونية والتنظيمية ذات الصلة بالأعمال والتقاضي في الإمارات."
                  : "Current legal and regulatory updates relevant to business and dispute matters in the UAE."}
              </p>
            </div>
            <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
              {isArabic ? "تحديث تلقائي" : "Auto-updated"}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalNews.map((news, index) => (
              <article
                key={`${news.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:bg-white/[0.05] transition-colors"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={getSafeImageUrl(news.image)}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold leading-snug text-slate-100 mb-4 line-clamp-3">
                    {news.title}
                  </h3>
                  {news.url ? (
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold"
                      style={{ color: palette.secondary }}
                    >
                      {isArabic ? "اقرأ المزيد" : "Read more"}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
