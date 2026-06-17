export type TeamMemberProfile = {
  slug: string;
  nameEn: string;
  nameAr: string;
  positionEn: string;
  positionAr: string;
  photo: string;
  casesHandledDisplayEn: string;
  casesHandledDisplayAr: string;
  casesInProgressEn: string;
  casesInProgressAr: string;
  casesDetailEn: string;
  casesDetailAr: string;
  practiceAreasEn: string[];
  practiceAreasAr: string[];
  highlightsEn: string[];
  highlightsAr: string[];
  overviewEn: string[];
  overviewAr: string[];
  phone: string;
  email: string;
  linkedin?: string;
};

const defaultPhone = "+971 50 409 6028";
const defaultEmail = "info@almahy.com";

export const teamMembers: TeamMemberProfile[] = [
  {
    slug: "dr-mohamed-al-mahy",
    nameEn: "Dr. Mohamed Al Mahy",
    nameAr: "الدكتور محمد المحي",
    positionEn: "FOUNDER & MANAGING PARTNER",
    positionAr: "المؤسس والمدير العام",
    photo: "/assets/employs/Dr%20Almahy.webp",
    casesHandledDisplayEn: "150+",
    casesHandledDisplayAr: "+150",
    casesInProgressEn: "Multiple corporate, civil, and arbitration files remain active.",
    casesInProgressAr: "توجد ملفات مؤسسية ومدنية وتحكيمية متعددة لا تزال قيد المتابعة.",
    casesDetailEn:
      "Dr. Mohamed Al Mahy has led more than 150 mandates across civil litigation, commercial disputes, corporate advisory, and arbitration. His caseload includes company formation disputes, board governance matters, banking claims, labor conflicts, and complex enforcement files across UAE courts and authorities.",
    casesDetailAr:
      "قاد الدكتور محمد المحي أكثر من 150 ملفاً في التقاضي المدني والنزاعات التجارية والاستشارات المؤسسية والتحكيم، وتشمل قضاياه نزاعات تأسيس الشركات وحوكمة مجالس الإدارة ومطالبات مصرفية ونزاعات عمل وملفات تنفيذ معقدة أمام محاكم وجهات الإمارات.",
    practiceAreasEn: ["Corporate Law", "Civil Litigation", "Arbitration", "Business Setup", "Banking Disputes"],
    practiceAreasAr: ["قانون الشركات", "التقاضي المدني", "التحكيم", "تأسيس الأعمال", "النزاعات المصرفية"],
    highlightsEn: [
      "Represents companies and individuals in high-value civil and commercial disputes.",
      "Advises on corporate structure, licensing, and regulatory compliance in the UAE.",
      "Handles arbitration and court proceedings from filing through judgment execution.",
    ],
    highlightsAr: [
      "يمثل الشركات والأفراد في نزاعات مدنية وتجارية عالية القيمة.",
      "يقدم استشارات حول الهيكلة المؤسسية والتراخيص والامتثال التنظيمي في الإمارات.",
      "يتولى التحكيم والإجراءات القضائية من الإيداع حتى تنفيذ الأحكام.",
    ],
    overviewEn: [
      "Founder and Managing Partner of Almahy Legal Services, guiding the firm's strategy across litigation, corporate services, and client representation in Dubai and the wider UAE.",
      "Known for combining legal precision with practical business understanding, especially in matters involving shareholders, contracts, and authority procedures.",
    ],
    overviewAr: [
      "المؤسس والمدير العام لشركة المحامي للخدمات القانونية، ويقود استراتيجية المكتب في التقاضي وخدمات الشركات وتمثيل العملاء في دبي وعموم الإمارات.",
      "معروف بدمج الدقة القانونية مع الفهم العملي للأعمال، خاصة في مسائل الشركاء والعقود وإجراءات الجهات الرسمية.",
    ],
    phone: defaultPhone,
    email: defaultEmail,
    linkedin: "https://www.linkedin.com/in/almahy-mohamed-a9a82565",
  },
  {
    slug: "abdelrahman-mattar",
    nameEn: "Abdelrahman Mattar",
    nameAr: "عبد الرحمن مطر",
    positionEn: "LEGAL CONSULTANT",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Abdelrahman%20mattar%20copy.webp",
    casesHandledDisplayEn: "28+",
    casesHandledDisplayAr: "+28",
    casesInProgressEn: "12 active files across contracts, civil claims, and advisory work.",
    casesInProgressAr: "12 ملفاً نشطاً في العقود والمطالبات المدنية والاستشارات.",
    casesDetailEn:
      "Abdelrahman Mattar has handled more than 28 cases involving contract disputes, civil claims, document review, and pre-litigation advisory. He supports clients from initial legal assessment through drafting, negotiation, and court preparation.",
    casesDetailAr:
      "تولى عبد الرحمن مطر أكثر من 28 قضية في نزاعات العقود والمطالبات المدنية ومراجعة المستندات والاستشارات قبل التقاضي، ويدعم العملاء من التقييم القانوني الأولي حتى الصياغة والتفاوض والإعداد للمحكمة.",
    practiceAreasEn: ["Contract Law", "Civil Disputes", "Legal Drafting", "Commercial Advisory"],
    practiceAreasAr: ["قانون العقود", "النزاعات المدنية", "الصياغة القانونية", "الاستشارات التجارية"],
    highlightsEn: [
      "Reviews and drafts agreements, notices, and legal correspondence.",
      "Prepares case files for civil and commercial court proceedings.",
      "Advises clients on dispute strategy before escalation to litigation.",
    ],
    highlightsAr: [
      "يراجع ويصوغ الاتفاقيات والإشعارات والمراسلات القانونية.",
      "يعد ملفات القضايا للإجراءات أمام المحاكم المدنية والتجارية.",
      "يقدم استشارات حول استراتيجية النزاع قبل التصعيد إلى التقاضي.",
    ],
    overviewEn: [
      "Legal Consultant focused on turning complex contractual issues into clear, actionable legal steps for businesses and individuals.",
    ],
    overviewAr: ["مستشار قانوني يركز على تحويل القضايا التعاقدية المعقدة إلى خطوات قانونية واضحة وقابلة للتنفيذ للشركات والأفراد."],
    phone: defaultPhone,
    email: defaultEmail,
  },
  {
    slug: "ahmed-shokry",
    nameEn: "Ahmed Shokry",
    nameAr: "أحمد شكري",
    positionEn: "LEGAL COUNSEL",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Ahmad%20Shokry%20copy.webp",
    casesHandledDisplayEn: "35+",
    casesHandledDisplayAr: "+35",
    casesInProgressEn: "9 corporate and regulatory files currently under review.",
    casesInProgressAr: "9 ملفات مؤسسية وتنظيمية قيد المراجعة حالياً.",
    casesDetailEn:
      "Ahmed Shokry has managed more than 35 matters covering corporate compliance, commercial contracts, licensing updates, and internal legal documentation for UAE companies. His work includes authority submissions, legal risk review, and ongoing counsel for management teams.",
    casesDetailAr:
      "أدار أحمد شكري أكثر من 35 ملفاً تشمل الامتثال المؤسسي والعقود التجارية وتحديثات التراخيص والتوثيق القانوني الداخلي للشركات في الإمارات، ويشمل عمله التقديمات للجهات الرسمية ومراجعة المخاطر القانونية والاستشارات المستمرة للإدارات.",
    practiceAreasEn: ["Corporate Compliance", "Commercial Contracts", "Regulatory Advisory", "Legal Documentation"],
    practiceAreasAr: ["الامتثال المؤسسي", "العقود التجارية", "الاستشارات التنظيمية", "التوثيق القانوني"],
    highlightsEn: [
      "Supports companies with contract structuring and compliance reviews.",
      "Coordinates legal documentation for licensing and corporate updates.",
      "Provides ongoing counsel to reduce regulatory and contractual exposure.",
    ],
    highlightsAr: [
      "يدعم الشركات في هيكلة العقود ومراجعات الامتثال.",
      "ينسق التوثيق القانوني للتراخيص والتحديثات المؤسسية.",
      "يقدم استشارات مستمرة للحد من المخاطر التنظيمية والتعاقدية.",
    ],
    overviewEn: [
      "Legal Counsel with a strong focus on corporate and regulatory matters, helping businesses maintain compliant operations while managing day-to-day legal risk.",
    ],
    overviewAr: [
      "مستشار قانوني يركز على المسائل المؤسسية والتنظيمية، ويساعد الشركات على الحفاظ على امتثال عملياتها مع إدارة المخاطر القانونية اليومية.",
    ],
    phone: defaultPhone,
    email: defaultEmail,
    linkedin: "https://www.linkedin.com/in/ahmed-shokry-17257816b",
  },
  {
    slug: "dalia-ghonem",
    nameEn: "Dalia Ghonem",
    nameAr: "داليا غنيم",
    positionEn: "LEGAL CONSULTANT",
    positionAr: "مستشارة قانونية",
    photo: "/assets/employs/Dalia%20Ghonem%20copy.webp",
    casesHandledDisplayEn: "22+",
    casesHandledDisplayAr: "+22",
    casesInProgressEn: "7 family and civil files remain under active follow-up.",
    casesInProgressAr: "7 ملفات أسرية ومدنية لا تزال قيد المتابعة النشطة.",
    casesDetailEn:
      "Dalia Ghonem has handled more than 22 cases in family law, civil disputes, and corporate documentation. She assists clients with sensitive personal matters, court filings, and the preparation of legal documents required by UAE authorities.",
    casesDetailAr:
      "تولت داليا غنيم أكثر من 22 قضية في قانون الأسرة والنزاعات المدنية وتوثيق الشركات، وتساعد العملاء في المسائل الشخصية الحساسة وإيداع الدعاوى وإعداد المستندات القانونية المطلوبة من جهات الإمارات.",
    practiceAreasEn: ["Family Law", "Civil Disputes", "Corporate Documentation", "Legal Drafting"],
    practiceAreasAr: ["قانون الأسرة", "النزاعات المدنية", "توثيق الشركات", "الصياغة القانونية"],
    highlightsEn: [
      "Prepares and reviews legal documents for court and authority use.",
      "Supports clients in family and civil matters with structured case follow-up.",
      "Maintains clear communication throughout each stage of the legal process.",
    ],
    highlightsAr: [
      "تعد وتراجع المستندات القانونية للاستخدام القضائي والرسمي.",
      "تدعم العملاء في المسائل الأسرية والمدنية بمتابعة منظمة للملف.",
      "تحافظ على تواصل واضح خلال جميع مراحل الإجراءات القانونية.",
    ],
    overviewEn: [
      "Legal Consultant known for careful documentation and client-focused handling of civil and family-related legal work.",
    ],
    overviewAr: ["مستشارة قانونية معروفة بالدقة في التوثيق والاهتمام بالعميل في الأعمال القانونية المدنية والأسرية."],
    phone: defaultPhone,
    email: defaultEmail,
  },
  {
    slug: "maged-nafea",
    nameEn: "Maged Nafea",
    nameAr: "مجد نافع",
    positionEn: "LEGAL CONSULTANT",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Fadeel%20copy.webp",
    casesHandledDisplayEn: "30+",
    casesHandledDisplayAr: "+30",
    casesInProgressEn: "11 labor, rental, and commercial cases are still in process.",
    casesInProgressAr: "11 قضية عمل وإيجار وتجارية لا تزال قيد الإجراء.",
    casesDetailEn:
      "Maged Nafea has handled more than 30 cases in labor disputes, rental claims, and commercial litigation. His files include employee termination disputes, unpaid dues, lease conflicts, and contract enforcement before UAE courts and committees.",
    casesDetailAr:
      "تولى مجد نافع أكثر من 30 قضية في نزاعات العمل ومطالبات الإيجار والتقاضي التجاري، وتشمل ملفاته نزاعات إنهاء الخدمة والمستحقات غير المدفوعة وتعارضات الإيجار وتنفيذ العقود أمام محاكم ولجان الإمارات.",
    practiceAreasEn: ["Labor Law", "Rental Disputes", "Commercial Litigation", "Case Follow-up"],
    practiceAreasAr: ["قانون العمل", "نزاعات الإيجار", "التقاضي التجاري", "متابعة القضايا"],
    highlightsEn: [
      "Represents clients in labor cases from complaint through judgment stages.",
      "Handles rental disputes before relevant commissions and courts.",
      "Tracks commercial case progress through hearings, submissions, and updates.",
    ],
    highlightsAr: [
      "يمثل العملاء في قضايا العمل من الشكوى حتى مراحل الحكم.",
      "يتولى نزاعات الإيجار أمام اللجان والمحاكم المختصة.",
      "يتابع تقدم القضايا التجارية عبر الجلسات والمذكرات والتحديثات.",
    ],
    overviewEn: [
      "Legal Consultant with practical experience in labor, rental, and commercial disputes, focused on achieving clear outcomes through disciplined case management.",
    ],
    overviewAr: [
      "مستشار قانوني بخبرة عملية في نزاعات العمل والإيجار والتجارة، يركز على تحقيق نتائج واضحة من خلال إدارة منظمة للملفات.",
    ],
    phone: defaultPhone,
    email: defaultEmail,
  },
  {
    slug: "kaan-umulu",
    nameEn: "Kaan Umulu",
    nameAr: "كان أومولو",
    positionEn: "LEGAL ADVISOR",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Kaan%20copy.webp",
    casesHandledDisplayEn: "4",
    casesHandledDisplayAr: "4",
    casesInProgressEn: "Many of his cases are still in process across active court and authority stages.",
    casesInProgressAr: "لا تزال العديد من قضاياه قيد الإجراء في مراحل المحاكم والجهات الرسمية.",
    casesDetailEn:
      "Kaan Umulu has handled 4 cases directly to date. Several additional matters remain in process, including files awaiting hearings, authority responses, documentation, and enforcement steps. He is actively building his caseload across debt collection, criminal, real estate, and labor matters.",
    casesDetailAr:
      "تولى كان أومولو 4 قضايا بشكل مباشر حتى الآن، فيما لا تزال عدة ملفات إضافية قيد الإجراء بما في ذلك قضايا تنتظر الجلسات وردود الجهات والمستندات وخطوات التنفيذ، ويبني حالياً محفظة قضايا في تحصيل الديون والجنائي والعقارات والعمل.",
    practiceAreasEn: ["Debt Collection", "Criminal Law", "Real Estate", "Labor Law"],
    practiceAreasAr: ["تحصيل الديون", "القانون الجنائي", "القانون العقاري", "قانون العمل"],
    highlightsEn: [
      "Handles debt collection files from notice stage through enforcement follow-up.",
      "Supports criminal and real estate matters with document preparation and case tracking.",
      "Assists in labor disputes involving contracts, termination, and employee claims.",
      "Maintains detailed follow-up on every active file until the next legal step is completed.",
    ],
    highlightsAr: [
      "يتولى ملفات تحصيل الديون من مرحلة الإشعار حتى متابعة التنفيذ.",
      "يدعم القضايا الجنائية والعقارية بإعداد المستندات ومتابعة الملف.",
      "يساعد في نزاعات العمل المتعلقة بالعقود وإنهاء الخدمة ومطالبات الموظفين.",
      "يحافظ على متابعة تفصيلية لكل ملف نشط حتى اكتمال الخطوة القانونية التالية.",
    ],
    overviewEn: [
      "Legal Advisor at Almahy Legal Services, focused on debt collection, criminal law, real estate disputes, and labor cases.",
      "He deals closely with clients and authorities to move each file forward with clear documentation, timely submissions, and structured case updates.",
    ],
    overviewAr: [
      "مستشار قانوني في شركة المحامي للخدمات القانونية، يركز على تحصيل الديون والقانون الجنائي والنزاعات العقارية وقضايا العمل.",
      "يتعامل عن كثب مع العملاء والجهات الرسمية لإنجاز كل ملف من خلال توثيق واضح وتقديمات في الوقت المناسب وتحديثات منظمة للقضية.",
    ],
    phone: defaultPhone,
    email: defaultEmail,
    linkedin: "https://www.linkedin.com/in/kaan-umulu-5ab378138",
  },
  {
    slug: "mahmoud-abdel-fadeel",
    nameEn: "Mahmoud Abdel Fadeel",
    nameAr: "محمود عبد الفضيل",
    positionEn: "LEGAL CONSULTANT",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Mahmoud%20Abdel%20fadeel%20copy.webp",
    casesHandledDisplayEn: "32+",
    casesHandledDisplayAr: "+32",
    casesInProgressEn: "10 enforcement and civil files remain active.",
    casesInProgressAr: "10 ملفات تنفيذ ومدنية لا تزال نشطة.",
    casesDetailEn:
      "Mahmoud Abdel Fadeel has handled more than 32 cases involving civil litigation, commercial disputes, and judgment enforcement. His work includes preparing execution files, following court procedures, and coordinating with clients on recovery and compliance steps.",
    casesDetailAr:
      "تولى محمود عبد الفضيل أكثر من 32 قضية في التقاضي المدني والنزاعات التجارية وتنفيذ الأحكام، ويشمل عمله إعداد ملفات التنفيذ ومتابعة الإجراءات القضائية والتنسيق مع العملاء بشأن خطوات التحصيل والامتثال.",
    practiceAreasEn: ["Civil Litigation", "Commercial Disputes", "Judgment Enforcement", "Legal Follow-up"],
    practiceAreasAr: ["التقاضي المدني", "النزاعات التجارية", "تنفيذ الأحكام", "المتابعة القانونية"],
    highlightsEn: [
      "Prepares and follows civil and commercial case submissions.",
      "Supports judgment enforcement and post-judgment recovery steps.",
      "Keeps clients informed on court dates, requirements, and file status.",
    ],
    highlightsAr: [
      "يعد ويتابع مذكرات القضايا المدنية والتجارية.",
      "يدعم تنفيذ الأحكام وخطوات التحصيل بعد صدور الحكم.",
      "يبقي العملاء على اطلاع بمواعيد المحكمة والمتطلبات وحالة الملف.",
    ],
    overviewEn: [
      "Legal Consultant experienced in moving cases from dispute stage through judgment and into practical enforcement action.",
    ],
    overviewAr: ["مستشار قانوني بخبرة في نقل القضايا من مرحلة النزاع إلى الحكم ثم إلى إجراءات التنفيذ العملية."],
    phone: defaultPhone,
    email: defaultEmail,
  },
  {
    slug: "mohamed-elmaghraby",
    nameEn: "Mohamed Elmaghraby",
    nameAr: "محمد المغربي",
    positionEn: "LEGAL ADVISOR",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Mohamed%20Elmaghraby%20copy.webp",
    casesHandledDisplayEn: "26+",
    casesHandledDisplayAr: "+26",
    casesInProgressEn: "8 corporate and banking-related files are still under review.",
    casesInProgressAr: "8 ملفات مؤسسية ومصرفية لا تزال قيد المراجعة.",
    casesDetailEn:
      "Mohamed Elmaghraby has advised on more than 26 cases involving corporate structuring, banking-related disputes, commercial contracts, and compliance documentation. He supports both companies and individuals with authority coordination and legal file preparation.",
    casesDetailAr:
      "قدم محمد المغربي استشارات في أكثر من 26 قضية تشمل الهياكل المؤسسية والنزاعات المصرفية والعقود التجارية وتوثيق الامتثال، ويدعم الشركات والأفراد في التنسيق مع الجهات وإعداد الملفات القانونية.",
    practiceAreasEn: ["Corporate Advisory", "Banking Disputes", "Commercial Contracts", "Compliance"],
    practiceAreasAr: ["الاستشارات المؤسسية", "النزاعات المصرفية", "العقود التجارية", "الامتثال"],
    highlightsEn: [
      "Advises on corporate documents, agreements, and internal legal processes.",
      "Supports clients in banking and commercial dispute preparation.",
      "Coordinates legal steps required by authorities and company management.",
    ],
    highlightsAr: [
      "يقدم استشارات حول مستندات الشركات والاتفاقيات والعمليات القانونية الداخلية.",
      "يدعم العملاء في إعداد النزاعات المصرفية والتجارية.",
      "ينسق الخطوات القانونية المطلوبة من الجهات وإدارة الشركات.",
    ],
    overviewEn: [
      "Legal Advisor supporting corporate and banking-related legal work with a focus on documentation, compliance, and dispute readiness.",
    ],
    overviewAr: [
      "مستشار قانوني يدعم الأعمال القانونية المؤسسية والمصرفية مع التركيز على التوثيق والامتثال والاستعداد للنزاعات.",
    ],
    phone: defaultPhone,
    email: defaultEmail,
  },
  {
    slug: "mohamed-hassanein",
    nameEn: "Mohamed Hassanein",
    nameAr: "محمد حسنين",
    positionEn: "LEGAL CONSULTANT",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Mohamed%20Hassanein%20copy.webp",
    casesHandledDisplayEn: "24+",
    casesHandledDisplayAr: "+24",
    casesInProgressEn: "9 labor, rental, and civil cases remain in active follow-up.",
    casesInProgressAr: "9 قضايا عمل وإيجار ومدنية لا تزال قيد المتابعة النشطة.",
    casesDetailEn:
      "Mohamed Hassanein has handled more than 24 cases across labor disputes, rental conflicts, and civil litigation. He manages documentation, court submissions, and client updates throughout each stage of the legal process.",
    casesDetailAr:
      "تولى محمد حسنين أكثر من 24 قضية في نزاعات العمل وتعارضات الإيجار والتقاضي المدني، ويدير التوثيق والتقديمات القضائية وتحديثات العملاء خلال جميع مراحل الإجراءات القانونية.",
    practiceAreasEn: ["Labor Law", "Rental Disputes", "Civil Litigation", "Case Documentation"],
    practiceAreasAr: ["قانون العمل", "نزاعات الإيجار", "التقاضي المدني", "توثيق القضايا"],
    highlightsEn: [
      "Handles labor cases involving contracts, dues, and termination disputes.",
      "Supports rental cases before courts and dispute committees.",
      "Prepares organized legal files with complete supporting documents.",
    ],
    highlightsAr: [
      "يتولى قضايا العمل المتعلقة بالعقود والمستحقات ونزاعات إنهاء الخدمة.",
      "يدعم قضايا الإيجار أمام المحاكم ولجان النزاع.",
      "يعد ملفات قانونية منظمة مع مستندات داعمة كاملة.",
    ],
    overviewEn: [
      "Legal Consultant focused on labor, rental, and civil cases, with strong attention to documentation and procedural follow-up.",
    ],
    overviewAr: [
      "مستشار قانوني يركز على قضايا العمل والإيجار والمدنية، مع اهتمام قوي بالتوثيق والمتابعة الإجرائية.",
    ],
    phone: defaultPhone,
    email: defaultEmail,
  },
  {
    slug: "nasef-abdel-aal",
    nameEn: "Nasef Abdel Aal",
    nameAr: "ناصف عبد العال",
    positionEn: "LEGAL CONSULTANT",
    positionAr: "مستشار قانوني",
    photo: "/assets/employs/Nasef%20Abdelaal%20copy.webp",
    casesHandledDisplayEn: "27+",
    casesHandledDisplayAr: "+27",
    casesInProgressEn: "8 debt recovery and commercial files are still in process.",
    casesInProgressAr: "8 ملفات تحصيل ديون وتجارية لا تزال قيد الإجراء.",
    casesDetailEn:
      "Nasef Abdel Aal has handled more than 27 cases in commercial disputes, civil claims, and debt recovery support. His caseload includes unpaid dues, contract breaches, legal notices, and enforcement-related follow-up for corporate and individual clients.",
    casesDetailAr:
      "تولى ناصف عبد العال أكثر من 27 قضية في النزاعات التجارية والمطالبات المدنية ودعم تحصيل الديون، وتشمل ملفاته المستحقات غير المدفوعة وإخلال العقود والإشعارات القانونية ومتابعة التنفيذ للعملاء من الشركات والأفراد.",
    practiceAreasEn: ["Debt Recovery", "Commercial Disputes", "Civil Claims", "Legal Notices"],
    practiceAreasAr: ["تحصيل الديون", "النزاعات التجارية", "المطالبات المدنية", "الإشعارات القانونية"],
    highlightsEn: [
      "Supports debt collection procedures from initial notice to legal action.",
      "Handles commercial disputes involving unpaid invoices and contract breaches.",
      "Prepares legal notices and case documents for court and authority submission.",
    ],
    highlightsAr: [
      "يدعم إجراءات تحصيل الديون من الإشعار الأولي إلى الإجراء القانوني.",
      "يتولى النزاعات التجارية المتعلقة بالفواتير غير المدفوعة وإخلال العقود.",
      "يعد الإشعارات القانونية ومستندات القضايا للتقديم للمحاكم والجهات.",
    ],
    overviewEn: [
      "Legal Consultant with experience in commercial disputes and debt recovery, helping clients pursue unpaid dues through structured legal steps.",
    ],
    overviewAr: [
      "مستشار قانوني بخبرة في النزاعات التجارية وتحصيل الديون، يساعد العملاء على متابعة المستحقات غير المدفوعة عبر خطوات قانونية منظمة.",
    ],
    phone: defaultPhone,
    email: defaultEmail,
  },
];

export function getTeamMemberBySlug(slug: string): TeamMemberProfile | undefined {
  return teamMembers.find((member) => member.slug === slug);
}

export function getAllTeamSlugs(): string[] {
  return teamMembers.map((member) => member.slug);
}
