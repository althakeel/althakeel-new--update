import { Locale } from "@/lib/translations";

export default async function NotaryPublicServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValidLoc = locale === "en" || locale === "ar";
  const lang = isValidLoc ? (locale as Locale) : "en";

  const isArabic = lang === "ar";

  const sections = [
    {
      title: "Justice and Legal Documentation Services in the UAE",
      paragraphs: [
        "Legal certifications are a fundamental pillar in enhancing the reliability and authenticity of official documents before relevant authorities, both locally and internationally.",
        "Certification gives documents formal status, granting them legal weight and acceptability before courts, government bodies, and external entities.",
        "In light of increasing international transactions and diverse legal procedures, certification acts as a bridge between different legal systems, facilitating cross-border document exchange with clear legal guarantees.",
      ],
    },
    {
      title: "Attestations",
      paragraphs: [
        "We provide tailored attestation services for legal, personal, and corporate documents to ensure official recognition before UAE and international authorities.",
      ],
    },
    {
      title: "Authentication of Power of Attorney",
      paragraphs: [
        "As part of our commitment to comprehensive legal solutions, we draft and notarize all types of powers of attorney with precision and professionalism in line with applicable laws.",
        "A power of attorney allows the principal to authorize another person to carry out specific actions or transactions, facilitating legal processes and safeguarding rights.",
        "We prepare general and special powers of attorney, temporary or permanent, including matters related to asset management and legal representation.",
        "Through extensive practical experience, we provide clear legal guidance to help each client select the most suitable power of attorney type.",
      ],
    },
    {
      title: "Corporate and Business-Related Attestations",
      paragraphs: [
        "In today’s business world, corporate certifications are essential to ensure legal validity and credibility of transactions locally and internationally.",
        "These certifications function as legal proof of authenticity for business documentation, strengthen trust between parties, and support smooth commercial operations.",
        "Official certifications enhance transparency, protect rights, reduce disputes, and are often required by government entities, financial institutions, and international partners.",
      ],
    },
    {
      title: "Legal Declarations",
      paragraphs: [
        "Legal declarations are key tools for establishing rights and regulating obligations between individuals and entities in financial, family, real estate, and commercial matters.",
        "A declaration is an explicit acknowledgment of a right or obligation, which helps prevent or resolve legal disputes.",
        "Declaration types vary based on purpose and legal context, whether submitted before official authorities or used in private transactions.",
      ],
    },
    {
      title: "Legal Notice",
      paragraphs: [
        "In Dubai, revoking a power of attorney is a significant legal process that must be handled precisely to clarify legal relationships and prevent misuse of granted powers.",
        "We provide end-to-end support for preparing and serving official revocation notices, tailored to the specific type of power of attorney and the client’s circumstances.",
      ],
    },
  ];

  const wills = [
    {
      title: "Sharia-Compliant Will (for non-heirs)",
      desc: "Allows allocation of up to one-third of the estate to non-heirs or charitable purposes, such as mosque donations, student support, or charitable endowment.",
    },
    {
      title: "Debt and Trust Repayment Will",
      desc: "Directs settlement of outstanding debts and return of entrusted property after death, with priority over inheritance distribution.",
    },
    {
      title: "Will to Appoint Guardian for Minor Children or Estate",
      desc: "When minors or unmanaged assets are involved, the testator appoints a trusted person to manage affairs until beneficiaries reach legal age.",
    },
    {
      title: "Instructions for Specific Actions After Death",
      desc: "Includes post-death instructions such as donations, pilgrimage on behalf of the deceased, or preferred burial arrangements.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#160A0A]" />
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16 text-center flex flex-col items-center">
          <p className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 mb-5">
            {isArabic ? "الماحي للخدمات القانونية" : "AUTHORIZED LEGAL AND NOTARY SERVICES"}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 max-w-5xl">
            {isArabic ? "العدالة وخدمات التوثيق القانوني في الإمارات" : "JUSTICE AND LEGAL DOCUMENTATION SERVICES IN THE UAE"}
          </h1>
          <p className="text-slate-200 text-base md:text-lg max-w-4xl leading-relaxed mb-7">
            {isArabic
              ? "خدمات توثيق وتصديق قانونية احترافية تمنح مستنداتك قوة قانونية أمام المحاكم والجهات الحكومية والجهات الدولية، مع أعلى درجات الدقة والاعتمادية."
              : "Professional legal documentation and notary support that gives your documents full legal credibility before courts, government entities, and international authorities."}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/971504096028?text=Hello%2C%20I%20need%20notary%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-slate-200">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-semibold text-amber-200 leading-snug">{section.title}</h2>
              </div>

              <div className="space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-slate-200 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="rounded-3xl border border-amber-100/20 bg-gradient-to-br from-[#160A0A] via-[#160A0A] to-[#160A0A] p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-200 mb-3">Wills</h2>
          <p className="text-slate-300 mb-6">
            Structured will drafting services in line with UAE legal requirements and practical family protection needs.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {wills.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-lg font-semibold text-amber-100 mb-2">{item.title}</h3>
                <p className="text-slate-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 pt-5 border-t border-white/10 text-slate-300">
            <p>
              Website: <a href="https://almahy.com/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200">https://almahy.com/</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
