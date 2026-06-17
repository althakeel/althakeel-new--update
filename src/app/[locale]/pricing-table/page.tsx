import { Locale } from "@/lib/translations";
import { Metadata } from "next";
import PricingPackagesCarousel from "@/components/PricingPackagesCarousel";

type CaseItem = {
  title: string;
  description: string;
};

type PaymentItem = {
  collection: string;
  finalPayment: string;
  advancePayment: string;
};

type PackagePlan = {
  rightTitle: string;
  rightSubtitle: string;
  headerGradient: string;
  paymentItems: PaymentItem[];
  note: string;
};

function inclusionPayment(
  virtual: boolean,
  shared: boolean,
  privateOffice: boolean,
  includedLabel: string,
): PaymentItem {
  return {
    collection: virtual ? includedLabel : "",
    finalPayment: shared ? includedLabel : "",
    advancePayment: privateOffice ? includedLabel : "",
  };
}

const officeInclusionFlags = {
  virtual: [true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false],
  shared: [true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false],
  private: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
} as const;

function buildComparisonPaymentItems(includedLabel: string): PaymentItem[] {
  return officeInclusionFlags.virtual.map((_, index) =>
    inclusionPayment(
      officeInclusionFlags.virtual[index],
      officeInclusionFlags.shared[index],
      officeInclusionFlags.private[index],
      includedLabel,
    ),
  );
}

type PricingContent = {
  heading: string;
  leftTitle: string;
  caseTypeLabel: string;
  colCollection: string;
  colFinal: string;
  colAdvance: string;
  caseItems: CaseItem[];
  packages: PackagePlan[];
  accountingHeading: string;
  accountingCaseTypeLabel: string;
  accountingColCollection: string;
  accountingColFinal: string;
  accountingColAdvance: string;
  accountingCaseItems: CaseItem[];
  accountingPackages: PackagePlan[];
  corporateHeading: string;
  corporateCaseTypeLabel: string;
  corporateColCollection: string;
  corporateColFinal: string;
  corporateColAdvance: string;
  corporateCaseItems: CaseItem[];
  corporatePackages: PackagePlan[];
  corporatePackageColumns: [
    { title: string; price: string; contract: string },
    { title: string; price: string; contract: string },
    { title: string; price: string; contract: string },
  ];
};

const content: Record<Locale, PricingContent> = {
  en: {
    heading: "Legal Package",
    leftTitle: "",
    caseTypeLabel: "Case Type",
    colCollection: "Collection",
    colFinal: "Final Payment",
    colAdvance: "Advance Payment",
    caseItems: [
      {
        title: "HR",
        description:
          "Recruitment and Staffing Services, Employee Benefits and Compensation, Performance Management, HR Policy and Compliance, HR Consulting and Strategy.",
      },
      {
        title: "Other Services",
        description:
          "Reviewing agreements, contracts, legal advice and meetings related to company activity and relevant government entities and financial authorities.",
      },
      {
        title: "Debtors Information Collection",
        description:
          "Initial Contact, Information Gathering, Documentation, Data Verification, Analysis and Assessment, Legal and Compliance Checks, Reporting.",
      },
      {
        title: "Legal Notices",
        description:
          "Legal notice through the law firm, drafting, reviewing, and correspondence received.",
      },
      {
        title: "Notarized Legal Notice",
        description:
          "Drafting, reviewing, correspondence, receiving, and attestation with the Notary Public in Dubai and outside Dubai according to dispute type.",
      },
      {
        title: "Cheque Execution",
        description:
          "Fees of opening a file, collection services, registration of execution file in courts, circular, travel ban, and related judicial attachments.",
      },
      {
        title: "Labor Case",
        description:
          "Following up labor cases in all stages including first instance and appeal, and complete judgment execution procedures.",
      },
      {
        title: "Performance Order",
        description:
          "Payment orders or invoices, performance warnings, registration of cases and attendance of committees, and execution work until collection.",
      },
      {
        title: "Rent Cases",
        description:
          "All rent cases for residential and commercial properties related to Rental Disputes Commission or Civil Courts until completion of execution.",
      },
      {
        title: "Expert Dispute in Dispute Committee",
        description:
          "Expert works and attendance before dispute committees and submission of memoranda and regulations across specialized areas.",
      },
      {
        title: "Precautionary Seizures (As Separate Case)",
        description:
          "Advocacy and pleading in urgent orders and issuance of decisions of precautionary seizures, grievances and appeals.",
      },
      {
        title: "Civil and Commercial Cases",
        description:
          "All works of civil and commercial cases in full instances, first instance, appeals, challenge, specific expert and execution.",
      },
      {
        title: "Arbitration Cases",
        description:
          "Representation and registration before arbitration authorities, and follow-up of judgments by ratification before competent courts.",
      },
      {
        title: "Corporate",
        description:
          "Business Setup Start Up, Bank Account Opening, Trademark Registration, Golden Visa.",
      },
    ],
    packages: [
      {
        rightTitle: "GOLDEN PACKAGE",
        rightSubtitle: "10K MONTHLY",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: [
          { collection: "", finalPayment: "", advancePayment: "Not Included" },
          { collection: "", finalPayment: "", advancePayment: "Per File" },
          { collection: "", finalPayment: "", advancePayment: "500" },
          { collection: "", finalPayment: "", advancePayment: "1,500.00" },
          { collection: "5%", finalPayment: "", advancePayment: "4,000.00" },
          { collection: "3%", finalPayment: "", advancePayment: "8,000.00" },
          { collection: "5%", finalPayment: "4,000.00", advancePayment: "4,000.00" },
          { collection: "4%", finalPayment: "5,000.00", advancePayment: "5,000.00" },
          { collection: "", finalPayment: "5,000.00", advancePayment: "15,000.00" },
          { collection: "", finalPayment: "", advancePayment: "10,000.00" },
          { collection: "2%", finalPayment: "3%", advancePayment: "3%" },
          { collection: "3%", finalPayment: "2%", advancePayment: "3%" },
          { collection: "", finalPayment: "", advancePayment: "per service" },
        ],
        note: "In - Credit 5 hours. After consuming the above-mentioned credit hours, each hour will cost 700 DHS",
      },
      {
        rightTitle: "VIP PACKAGE",
        rightSubtitle: "15K MONTHLY",
        headerGradient: "linear-gradient(120deg,#8B7300 0%,#A88D10 34%,#C4A833 62%,#B79614 100%)",
        paymentItems: [
          { collection: "", finalPayment: "", advancePayment: "IN" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "750.00" },
          { collection: "5%", finalPayment: "", advancePayment: "1,500.00" },
          { collection: "3%", finalPayment: "", advancePayment: "4,000.00" },
          { collection: "5%", finalPayment: "4,000.00", advancePayment: "2,000.00" },
          { collection: "4%", finalPayment: "3,000.00", advancePayment: "3,000.00" },
          { collection: "", finalPayment: "5,000.00", advancePayment: "10,000.00" },
          { collection: "", finalPayment: "", advancePayment: "7,000.00" },
          { collection: "2%", finalPayment: "2%", advancePayment: "2%" },
          { collection: "2%", finalPayment: "2%", advancePayment: "2%" },
          { collection: "", finalPayment: "", advancePayment: "per service" },
        ],
        note: "in - Credit 9 hours After consuming the above-mentioned credit hours, each hour will cost 500 DHS",
      },
      {
        rightTitle: "DIAMOND PACKAGE",
        rightSubtitle: "21K MONTHLY",
        headerGradient: "linear-gradient(120deg,#9D6A43 0%,#B67A4E 38%,#C58C5E 65%,#A87349 100%)",
        paymentItems: [
          { collection: "", finalPayment: "", advancePayment: "IN" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "5%", finalPayment: "", advancePayment: "in" },
          { collection: "2%", finalPayment: "", advancePayment: "2,500.00" },
          { collection: "3%", finalPayment: "4,000.00", advancePayment: "in" },
          { collection: "3%", finalPayment: "2,000.00", advancePayment: "2,000.00" },
          { collection: "", finalPayment: "5,000.00", advancePayment: "5,000.00" },
          { collection: "", finalPayment: "", advancePayment: "5,000.00" },
          { collection: "2%", finalPayment: "2%", advancePayment: "1%" },
          { collection: "1%", finalPayment: "2%", advancePayment: "1%" },
          { collection: "", finalPayment: "", advancePayment: "per service" },
        ],
        note: "in - Credit 18 hours After consuming the above-mentioned credit hours, each hour will cost 350 DHS",
      },
    ],
    accountingHeading: "Accounting Package",
    accountingCaseTypeLabel: "Detailed Services",
    accountingColCollection: "Core",
    accountingColFinal: "Plus",
    accountingColAdvance: "Premium",
    accountingCaseItems: [
      {
        title: "VAT",
        description:
          "VAT Compliance\nMaintain records:\n• VAT invoices (sales and purchases)\n• Bank statements\n• Credit/debit notes\n• Import/export records\n• Financial statements (e.g., income statement, balance sheet)\nVAT Filing",
      },
      {
        title: "Auditing",
        description:
          "Collect and Analyze Information\nObtain documentation:\n• Financial statements\n• Trial balances\n• Policies\n• Contracts\n• Operational data\nDraft the Audit Report\nReview and finalize the report\nReviews of financial statements to ensure accuracy and compliance with accounting standards\nFinancial statements:\n• Balance Sheet (Statement of Financial Position)\n• Income Statement (Profit and Loss Statement)\n• Cash Flow Statement\n• Statement of Changes in Equity",
      },
      {
        title: "Accounting",
        description:
          "Accounting on a monthly basis\nMaintenance of monthly accounts on cloud-based accounting software\nPreparation of a chart of accounts according to company structure and management requirements\nAnalysis and interpretation of ledgers\nAccounts Receivable and Accounts Payable report\nRecord of Sale, Purchase activity, and applicable VAT\nInput Tax Credit report as per the law\nRecording and maintaining all cashbooks and bank statements\nEvaluation and filing of quarterly/monthly VAT returns\nPayroll Management\nGeneration and review of the Balance Sheet\nEvaluation of financial statements and providing a financial health report\nFixed Asset Management",
      },
      {
        title: "Budgeting",
        description:
          "Set Clear Financial Goals\nIdentify and Categorize Income Sources\nTrack and Analyze Past Expenses\nEstimate and Allocate Amounts\nMonitor and Adjust Regularly\nReview and Evaluate Financial Performance\nBuilding a Contingency Plan\nSet Up a Review Schedule",
      },
      {
        title: "AML",
        description:
          "Anti-Money Laundering (AML)\nInternal Controls and Risk Management\nThe goAML System\nPeriodic Reviews and Audits",
      },
      {
        title: "Corporate Tax",
        description:
          "Corporate Tax Filing (Tax Returns)\nAudits and Tax Assessments",
      },
      {
        title: "Additional Services",
        description:
          "Regular Employee 6 days per week\nTemporary Employee up to 3 days per week as per client requirements",
      },
    ],
    accountingPackages: [
      {
        rightTitle: "GOLDEN PACKAGE",
        rightSubtitle: "AED 8K MONTHLY/ 5H",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: [
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
        ],
        note: "Regular employee 6 days per week. Temporary employee up to 3 days per week as per client requirements.",
      },
      {
        rightTitle: "VIP PACKAGE",
        rightSubtitle: "AED 15K MONTHLY/9H",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: [
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "", finalPayment: "AED 6,000/ per month", advancePayment: "AED 4,000/ per month" },
        ],
        note: "Regular employee 6 days per week. Temporary employee up to 3 days per week as per client requirements.",
      },
      {
        rightTitle: "DIAMOND PACKAGE",
        rightSubtitle: "AED 25K MONTHLY/ 18H",
        headerGradient: "linear-gradient(120deg,#9D6A43 0%,#B67A4E 38%,#C58C5E 65%,#A87349 100%)",
        paymentItems: [
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
          { collection: "Included", finalPayment: "Included", advancePayment: "Included" },
        ],
        note: "Regular employee 6 days per week. Temporary employee up to 3 days per week as per client requirements.",
      },
    ],
    corporateHeading: "Corporate Package",
    corporateCaseTypeLabel: "Inclusions",
    corporateColCollection: "Virtual Office",
    corporateColFinal: "Shared Office",
    corporateColAdvance: "Private Office",
    corporateCaseItems: [
      { title: "Reception services", description: "Professional front-desk and visitor handling for your business address." },
      { title: "Telephone line", description: "Dedicated business line with call handling support." },
      { title: "High-speed internet", description: "Reliable connectivity for daily business operations." },
      { title: "Pantry/Kitchen use", description: "Access to shared pantry and kitchen facilities." },
      { title: "Cleaning services", description: "Regular cleaning and maintenance of office spaces." },
      { title: "Meeting room access", description: "Bookable meeting rooms for client and team sessions." },
      { title: "Ejari registration", description: "Tenancy registration support for licensing and visa processes." },
      { title: "Labor services", description: "Labor-related documentation and compliance support." },
      { title: "License registration", description: "Trade license registration and renewal assistance." },
      { title: "Immigration services", description: "Visa, residency, and immigration processing support." },
      { title: "Tax filing", description: "Corporate tax filing and compliance submissions." },
      { title: "Accounting", description: "Monthly bookkeeping and financial reporting." },
      { title: "Tax consultancy", description: "Strategic tax planning and advisory services." },
      { title: "VAT registration", description: "VAT registration and ongoing compliance support." },
      { title: "Collection services", description: "Debt collection and receivables management." },
      { title: "Trademark registration", description: "Brand and trademark protection registration." },
      { title: "Notary services", description: "Document notarization and attestation support." },
      { title: "Bank account opening", description: "Corporate bank account opening assistance." },
      { title: "Memorandum of understanding", description: "Drafting and review of MOU agreements." },
    ],
    corporatePackages: [
      {
        rightTitle: "PACKAGES",
        rightSubtitle: "VIRTUAL • SHARED • PRIVATE OFFICE • 1-YR CONTRACT",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: buildComparisonPaymentItems("Included"),
        note: "",
      },
    ],
    corporatePackageColumns: [
      { title: "Virtual Office", price: "AED 4,000 Monthly", contract: "1-Yr Contract" },
      { title: "Shared Office", price: "AED 6,000 Monthly", contract: "1-Yr Contract" },
      { title: "Private Office", price: "AED 10,000 Monthly", contract: "1-Yr Contract" },
    ],
  },
  ar: {
    heading: "الباقات القانونية",
    leftTitle: "",
    caseTypeLabel: "نوع القضية",
    colCollection: "التحصيل",
    colFinal: "الدفعة النهائية",
    colAdvance: "الدفعة المقدمة",
    caseItems: [
      {
        title: "HR",
        description:
          "خدمات التوظيف والموارد البشرية، مزايا وتعويضات الموظفين، إدارة الأداء، سياسات الموارد البشرية والامتثال، والاستشارات والاستراتيجيات.",
      },
      {
        title: "خدمات أخرى",
        description:
          "مراجعة الاتفاقيات والعقود، وتقديم الاستشارات القانونية والاجتماعات المتعلقة بأنشطة الشركة وتعاملاتها مع الجهات الحكومية والهيئات المالية.",
      },
      {
        title: "تحصيل معلومات المدينين",
        description:
          "التواصل الأولي، جمع المعلومات، التوثيق، التحقق من البيانات، التحليل والتقييم، الفحص القانوني والامتثال، وإعداد التقارير.",
      },
      {
        title: "الإشعارات القانونية",
        description: "إشعار قانوني عبر مكتب المحاماة، وصياغته ومراجعته، واستلام المراسلات.",
      },
      {
        title: "الإشعار القانوني الموثق",
        description:
          "صياغة ومراجعة واستلام وتوثيق الإشعارات القانونية لدى كاتب العدل في دبي وخارجها حسب نوع النزاع.",
      },
      {
        title: "تنفيذ الشيكات",
        description:
          "رسوم فتح ملف، وخدمات التحصيل، وتسجيل ملف التنفيذ في المحاكم، والتعميم، ومنع السفر، والحجوزات المرتبطة بالتحصيل القضائي.",
      },
      {
        title: "قضايا العمل",
        description:
          "متابعة قضايا العمل في جميع الإجراءات والمراحل بما في ذلك الدرجة الأولى والاستئناف، ومتابعة تنفيذ الأحكام.",
      },
      {
        title: "أوامر الأداء",
        description:
          "أوامر السداد أو الفواتير، والتنبيهات بالأداء، وتسجيل القضايا وحضور اللجان، وجميع أعمال التنفيذ حتى التحصيل.",
      },
      {
        title: "قضايا الإيجارات",
        description:
          "جميع قضايا الإيجارات للعقارات السكنية والتجارية لدى لجنة فض المنازعات الإيجارية أو المحاكم المدنية حتى اكتمال التنفيذ.",
      },
      {
        title: "النزاعات أمام لجان الخبرة",
        description:
          "أعمال الخبرة والحضور أمام لجان النزاع وتقديم المذكرات واللوائح والدعوى المقابلة عند وجودها.",
      },
      {
        title: "الحجوزات التحفظية",
        description:
          "المرافعة في الأوامر المستعجلة وإصدار قرارات الحجوزات التحفظية والتظلمات والاستئنافات، بما في ذلك جميع درجات التقاضي.",
      },
      {
        title: "القضايا المدنية والتجارية",
        description:
          "جميع أعمال القضايا المدنية والتجارية في جميع درجاتها والدرجة الأولى والاستئناف والطعن والخبرة المتخصصة والتنفيذ.",
      },
      {
        title: "قضايا التحكيم",
        description:
          "التمثيل والتسجيل أمام جهات التحكيم، ومتابعة الأحكام بالتصديق أمام المحاكم المختصة حتى اكتمال التنفيذ.",
      },
      {
        title: "الشركات",
        description: "تأسيس الأعمال، فتح الحسابات البنكية، تسجيل العلامة التجارية، والإقامة الذهبية.",
      },
    ],
    packages: [
      {
        rightTitle: "الباقة الذهبية",
        rightSubtitle: "10K شهرياً",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: [
          { collection: "", finalPayment: "", advancePayment: "غير شامل" },
          { collection: "", finalPayment: "", advancePayment: "لكل ملف" },
          { collection: "", finalPayment: "", advancePayment: "500" },
          { collection: "", finalPayment: "", advancePayment: "1,500.00" },
          { collection: "5%", finalPayment: "", advancePayment: "4,000.00" },
          { collection: "3%", finalPayment: "", advancePayment: "8,000.00" },
          { collection: "5%", finalPayment: "4,000.00", advancePayment: "4,000.00" },
          { collection: "4%", finalPayment: "5,000.00", advancePayment: "5,000.00" },
          { collection: "", finalPayment: "5,000.00", advancePayment: "15,000.00" },
          { collection: "", finalPayment: "", advancePayment: "10,000.00" },
          { collection: "2%", finalPayment: "3%", advancePayment: "3%" },
          { collection: "3%", finalPayment: "2%", advancePayment: "3%" },
          { collection: "", finalPayment: "", advancePayment: "لكل خدمة" },
        ],
        note: "رصيد 5 ساعات. بعد استهلاك الساعات المذكورة أعلاه، ستكون تكلفة كل ساعة 700 درهم.",
      },
      {
        rightTitle: "باقة VIP",
        rightSubtitle: "15K شهرياً",
        headerGradient: "linear-gradient(120deg,#8B7300 0%,#A88D10 34%,#C4A833 62%,#B79614 100%)",
        paymentItems: [
          { collection: "", finalPayment: "", advancePayment: "IN" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "750.00" },
          { collection: "5%", finalPayment: "", advancePayment: "1,500.00" },
          { collection: "3%", finalPayment: "", advancePayment: "4,000.00" },
          { collection: "5%", finalPayment: "4,000.00", advancePayment: "2,000.00" },
          { collection: "4%", finalPayment: "3,000.00", advancePayment: "3,000.00" },
          { collection: "", finalPayment: "5,000.00", advancePayment: "10,000.00" },
          { collection: "", finalPayment: "", advancePayment: "7,000.00" },
          { collection: "2%", finalPayment: "2%", advancePayment: "2%" },
          { collection: "2%", finalPayment: "2%", advancePayment: "2%" },
          { collection: "", finalPayment: "", advancePayment: "لكل خدمة" },
        ],
        note: "رصيد 9 ساعات. بعد استهلاك الساعات المذكورة أعلاه، ستكون تكلفة كل ساعة 500 درهم.",
      },
      {
        rightTitle: "باقة الألماس",
        rightSubtitle: "21K شهرياً",
        headerGradient: "linear-gradient(120deg,#9D6A43 0%,#B67A4E 38%,#C58C5E 65%,#A87349 100%)",
        paymentItems: [
          { collection: "", finalPayment: "", advancePayment: "IN" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "", finalPayment: "", advancePayment: "in" },
          { collection: "5%", finalPayment: "", advancePayment: "in" },
          { collection: "2%", finalPayment: "", advancePayment: "2,500.00" },
          { collection: "3%", finalPayment: "4,000.00", advancePayment: "in" },
          { collection: "3%", finalPayment: "2,000.00", advancePayment: "2,000.00" },
          { collection: "", finalPayment: "5,000.00", advancePayment: "5,000.00" },
          { collection: "", finalPayment: "", advancePayment: "5,000.00" },
          { collection: "2%", finalPayment: "2%", advancePayment: "1%" },
          { collection: "1%", finalPayment: "2%", advancePayment: "1%" },
          { collection: "", finalPayment: "", advancePayment: "لكل خدمة" },
        ],
        note: "رصيد 18 ساعة. بعد استهلاك الساعات المذكورة أعلاه، ستكون تكلفة كل ساعة 350 درهم.",
      },
    ],
    accountingHeading: "باقة المحاسبة",
    accountingCaseTypeLabel: "الخدمات التفصيلية",
    accountingColCollection: "الأساسي",
    accountingColFinal: "بلس",
    accountingColAdvance: "المتقدم",
    accountingCaseItems: [
      {
        title: "ضريبة القيمة المضافة",
        description:
          "الامتثال لضريبة القيمة المضافة\nالحفاظ على السجلات:\n• فواتير ضريبة القيمة المضافة (المبيعات والمشتريات)\n• كشوفات البنك\n• إشعارات دائن/مدين\n• سجلات الاستيراد/التصدير\n• البيانات المالية (مثل قائمة الدخل والميزانية العمومية)\nتقديم إقرارات ضريبة القيمة المضافة",
      },
      {
        title: "التدقيق",
        description:
          "جمع وتحليل المعلومات\nالحصول على المستندات:\n• البيانات المالية\n• ميزان المراجعة\n• السياسات\n• العقود\n• البيانات التشغيلية\nإعداد تقرير التدقيق\nمراجعة التقرير واعتماده\nمراجعة البيانات المالية لضمان الدقة والامتثال للمعايير المحاسبية\nالبيانات المالية:\n• الميزانية العمومية\n• قائمة الدخل\n• قائمة التدفقات النقدية\n• قائمة التغيرات في حقوق الملكية",
      },
      {
        title: "المحاسبة",
        description:
          "المحاسبة بشكل شهري\nصيانة الحسابات الشهرية على برنامج محاسبي سحابي\nإعداد دليل الحسابات وفق هيكل الشركة ومتطلبات الإدارة\nتحليل وتفسير القيود\nتقرير الذمم المدينة والدائنة\nتسجيل حركة البيع والشراء وضريبة القيمة المضافة\nتقرير ضريبة المدخلات وفق النظام\nتسجيل وصيانة الدفاتر النقدية وكشوفات البنوك\nإعداد وتقديم إقرارات ضريبة القيمة المضافة الشهرية/الربع سنوية\nإدارة الرواتب\nإعداد ومراجعة الميزانية العمومية\nتقييم البيانات المالية وتقديم تقرير عن الوضع المالي\nإدارة الأصول الثابتة",
      },
      {
        title: "إعداد الميزانية",
        description:
          "تحديد الأهداف المالية\nتحديد وتصنيف مصادر الدخل\nتتبع وتحليل المصروفات السابقة\nتقدير وتوزيع المبالغ\nالمتابعة والتعديل بشكل دوري\nمراجعة وتقييم الأداء المالي\nبناء خطة للطوارئ\nوضع جدول مراجعة",
      },
      {
        title: "مكافحة غسل الأموال",
        description:
          "مكافحة غسل الأموال (AML)\nالضوابط الداخلية وإدارة المخاطر\nنظام goAML\nالمراجعات والتدقيقات الدورية",
      },
      {
        title: "ضريبة الشركات",
        description:
          "إقرارات ضريبة الشركات\nالتدقيقات والتقييمات الضريبية",
      },
      {
        title: "خدمات إضافية",
        description:
          "موظف منتظم 6 أيام أسبوعياً\nموظف مؤقت حتى 3 أيام أسبوعياً حسب متطلبات العميل",
      },
    ],
    accountingPackages: [
      {
        rightTitle: "GOLDEN PACKAGE",
        rightSubtitle: "AED 8K MONTHLY/ 5H",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: [
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
        ],
        note: "موظف منتظم 6 أيام أسبوعياً. موظف مؤقت حتى 3 أيام أسبوعياً حسب متطلبات العميل.",
      },
      {
        rightTitle: "VIP PACKAGE",
        rightSubtitle: "AED 15K MONTHLY/9H",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: [
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "", finalPayment: "AED 6,000/ per month", advancePayment: "AED 4,000/ per month" },
        ],
        note: "موظف منتظم 6 أيام أسبوعياً. موظف مؤقت حتى 3 أيام أسبوعياً حسب متطلبات العميل.",
      },
      {
        rightTitle: "DIAMOND PACKAGE",
        rightSubtitle: "AED 25K MONTHLY/ 18H",
        headerGradient: "linear-gradient(120deg,#9D6A43 0%,#B67A4E 38%,#C58C5E 65%,#A87349 100%)",
        paymentItems: [
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
          { collection: "مشمول", finalPayment: "مشمول", advancePayment: "مشمول" },
        ],
        note: "موظف منتظم 6 أيام أسبوعياً. موظف مؤقت حتى 3 أيام أسبوعياً حسب متطلبات العميل.",
      },
    ],
    corporateHeading: "باقة الشركات",
    corporateCaseTypeLabel: "المحتويات",
    corporateColCollection: "المكتب الافتراضي",
    corporateColFinal: "المكتب المشترك",
    corporateColAdvance: "المكتب الخاص",
    corporateCaseItems: [
      { title: "خدمات الاستقبال", description: "استقبال احترافي للزوار وإدارة المكالمات في عنوان عملك." },
      { title: "خط الهاتف", description: "خط أعمال مخصص مع دعم استقبال المكالمات." },
      { title: "إنترنت عالي السرعة", description: "اتصال موثوق للعمليات اليومية." },
      { title: "استخدام المطبخ/البوفيه", description: "الوصول إلى مطبخ وبوفيه مشترك." },
      { title: "خدمات التنظيف", description: "تنظيف وصيانة دورية للمكاتب." },
      { title: "غرفة الاجتماعات", description: "غرف اجتماعات قابلة للحجز للعملاء والفرق." },
      { title: "تسجيل إيجاري", description: "دعم تسجيل عقد الإيجار للتراخيص والتأشيرات." },
      { title: "خدمات العمالة", description: "دعم مستندات العمالة والامتثال." },
      { title: "تسجيل الرخصة", description: "تسجيل وتجديد الرخصة التجارية." },
      { title: "خدمات الهجرة", description: "دعم التأشيرات والإقامة والهجرة." },
      { title: "تقديم الإقرارات الضريبية", description: "تقديم إقرارات ضريبة الشركات والامتثال." },
      { title: "المحاسبة", description: "مسك الدفاتر والتقارير المالية الشهرية." },
      { title: "استشارات ضريبية", description: "تخطيط ضريبي استراتيجي وخدمات استشارية." },
      { title: "تسجيل ضريبة القيمة المضافة", description: "تسجيل VAT والامتثال المستمر." },
      { title: "خدمات التحصيل", description: "تحصيل الديون وإدارة المستحقات." },
      { title: "تسجيل العلامات التجارية", description: "تسجيل وحماية العلامة التجارية." },
      { title: "خدمات التوثيق", description: "توثيق المستندات واعتمادها." },
      { title: "فتح حسابات بنكية", description: "مساعدة في فتح الحسابات البنكية للشركات." },
      { title: "مذكرة تفاهم", description: "صياغة ومراجعة مذكرات التفاهم." },
    ],
    corporatePackages: [
      {
        rightTitle: "الباقات",
        rightSubtitle: "مكتب افتراضي • مشترك • خاص • عقد لمدة سنة",
        headerGradient: "linear-gradient(120deg,#A87900 0%,#C79B1F 35%,#E2C263 62%,#C4910F 100%)",
        paymentItems: buildComparisonPaymentItems("مشمول"),
        note: "",
      },
    ],
    corporatePackageColumns: [
      { title: "المكتب الافتراضي", price: "4,000 درهم شهرياً", contract: "عقد لمدة سنة" },
      { title: "المكتب المشترك", price: "6,000 درهم شهرياً", contract: "عقد لمدة سنة" },
      { title: "المكتب الخاص", price: "10,000 درهم شهرياً", contract: "عقد لمدة سنة" },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const lang: Locale = locale === "ar" ? "ar" : "en";

  return {
    title: lang === "ar" ? "باقات الخدمات القانونية | Almahy" : "Legal Services Packages | Almahy",
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang: Locale = locale === "ar" ? "ar" : "en";
  const page = content[lang];
  const whatsappPhone = (process.env.NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER || "971504096028").replace(/[^\d]/g, "");
  const salesMessage =
    lang === "ar"
      ? "مرحباً، أرغب في باقة مخصصة تناسب احتياجات عملي."
      : "Hello, I need a custom package for my business.";
  const whatsappHref = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(salesMessage)}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-2 pb-0 pt-24 md:px-4 md:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-[36%] -left-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-[18%] -right-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-black tracking-[0.03em] text-white md:text-4xl">
            {lang === "ar" ? "باقات خدماتنا" : "Our Service Packages"}
          </h1>
          <p className="mt-2 text-sm font-medium text-white/85 md:text-base">
            {lang === "ar"
              ? "اختر الباقة المناسبة لاحتياجات عملك"
              : "Choose the perfect plan for your business needs"}
          </p>
        </div>

        <h2 className="text-center text-xl font-black tracking-[0.03em] text-[#FFD237] md:text-3xl">
          {page.heading}
        </h2>
        <div className="mx-auto mb-8 mt-4 h-1 w-16 rounded-full bg-[#FFD237]" />
        <PricingPackagesCarousel
          caseTypeLabel={page.caseTypeLabel}
          colCollection={page.colCollection}
          colFinal={page.colFinal}
          colAdvance={page.colAdvance}
          caseItems={page.caseItems}
          packages={page.packages}
          isArabic={lang === "ar"}
        />

        <div className="my-12 flex items-center gap-6 md:my-16 md:gap-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/30 to-amber-300/10" />
          <span className="text-xl text-amber-300 md:text-2xl">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-300/30 to-amber-300/10" />
        </div>

        <div className="mt-16">
          <h2 className="text-center text-xl font-black tracking-[0.03em] text-[#FFD237] md:text-3xl">
            {page.accountingHeading}
          </h2>
          <div className="mx-auto mb-8 mt-4 h-1 w-16 rounded-full bg-[#FFD237]" />

          <PricingPackagesCarousel
            caseTypeLabel={page.accountingCaseTypeLabel}
            colCollection={page.accountingColCollection}
            colFinal={page.accountingColFinal}
            colAdvance={page.accountingColAdvance}
            caseItems={page.accountingCaseItems}
            packages={page.accountingPackages}
            isArabic={lang === "ar"}
            maxWidthClassName="max-w-[920px]"
          />
        </div>

        <div className="my-12 flex items-center gap-6 md:my-16 md:gap-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/30 to-amber-300/10" />
          <span className="text-xl text-amber-300 md:text-2xl">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-300/30 to-amber-300/10" />
        </div>

        <div className="mt-16">
          <h2 className="text-center text-xl font-black tracking-[0.03em] text-[#FFD237] md:text-3xl">
            {page.corporateHeading}
          </h2>
          <div className="mx-auto mb-8 mt-4 h-1 w-16 rounded-full bg-[#FFD237]" />

          <PricingPackagesCarousel
            caseTypeLabel={page.corporateCaseTypeLabel}
            colCollection={page.corporateColCollection}
            colFinal={page.corporateColFinal}
            colAdvance={page.corporateColAdvance}
            caseItems={page.corporateCaseItems}
            packages={page.corporatePackages}
            isArabic={lang === "ar"}
            noteRowIndex={false}
            inclusionMode
            packageColumns={page.corporatePackageColumns}
          />
        </div>

        <div className="my-12 flex items-center gap-6 md:my-16 md:gap-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/30 to-amber-300/10" />
          <span className="text-xl text-amber-300 md:text-2xl">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-300/30 to-amber-300/10" />
        </div>

      </div>

      <section className="-mx-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-14 text-center md:-mx-4 md:px-10">
        <h3 className="text-3xl font-black tracking-[0.02em] text-[#FFD237] md:text-[40px]">
          {lang === "ar" ? "تحتاج إلى باقة مخصصة؟" : "Need a Custom Plan?"}
        </h3>
        <p className="mx-auto mt-5 max-w-3xl text-base font-semibold text-[#F2EBCF] md:text-[24px] md:leading-[1.3]">
          {lang === "ar"
            ? "تواصل معنا للحصول على حل مصمم خصيصاً لاحتياجات عملك."
            : "Contact us for a tailored solution that fits your unique business requirements."}
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-10 inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#D9B44A] bg-[#D9C06F] px-8 py-4 text-lg font-black text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:bg-[#E2CB7D]"
        >
          {lang === "ar" ? "تواصل مع فريق المبيعات" : "Contact Sales Team"}
        </a>
      </section>
    </main>
  );
}
