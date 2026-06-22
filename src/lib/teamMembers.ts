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
  credentialsEn?: {
    institution: string;
    certificate: string;
    date?: string;
  }[];
  credentialsAr?: {
    institution: string;
    certificate: string;
    date?: string;
  }[];
  phone: string;
  email: string;
  linkedin?: string;
};

const defaultPhone = "+971 50 409 6028";
const defaultEmail = "info@almahy.com";

export const teamMembers: TeamMemberProfile[] = [
  {
    slug: "dr-almahy",
    nameEn: "Almahy Mohamed",
    nameAr: "الدكتور محمد المحي",
    positionEn: "FOUNDER & MANAGING PARTNER",
    positionAr: "المؤسس والمدير العام",
    photo: "/assets/employs/Dr%20Almahy.webp",
    casesHandledDisplayEn: "900+",
    casesHandledDisplayAr: "+900",
    casesInProgressEn: "Multiple corporate, civil, and arbitration files remain active.",
    casesInProgressAr: "توجد ملفات مؤسسية ومدنية وتحكيمية متعددة لا تزال قيد المتابعة.",
    casesDetailEn:
      "Almahy Mohamed has led 900+ mandates across civil litigation, commercial disputes, corporate advisory, and arbitration. His caseload includes company formation disputes, board governance matters, banking claims, labor conflicts, and complex enforcement files across UAE courts and authorities.",
    casesDetailAr:
      "قاد الدكتور محمد المحي أكثر من 900 ملف في التقاضي المدني والنزاعات التجارية والاستشارات المؤسسية والتحكيم، وتشمل قضاياه نزاعات تأسيس الشركات وحوكمة مجالس الإدارة ومطالبات مصرفية ونزاعات عمل وملفات تنفيذ معقدة أمام محاكم وجهات الإمارات.",
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
      "Almahy Mohamed's professional profile is supported by formal legal education and specialized training in private law, arbitration, translation studies, and continuing legal education.",
      "His academic and professional development includes programs from Egyptian, American, and international legal institutions, with a focus on arbitration practice, private law, legal skills, and professional standards.",
    ],
    overviewAr: [
      "تستند الخبرة المهنية للأستاذ المحي محمد إلى تعليم قانوني رسمي وتدريب متخصص في القانون الخاص والتحكيم ودراسات الترجمة والتعليم القانوني المستمر.",
      "تشمل مسيرته الأكاديمية والمهنية برامج من مؤسسات قانونية مصرية وأمريكية ودولية، مع تركيز على ممارسات التحكيم والقانون الخاص والمهارات القانونية والمعايير المهنية.",
    ],
    credentialsEn: [
      {
        institution: "The Arabian European Center for Arbitration and Training",
        certificate: "Certification: Egyptian Arbitration Law in Light of International Laws",
        date: "December 14, 2009 - January 18, 2010",
      },
      {
        institution: "The American University in Cairo, School of Continuing Education",
        certificate: "Foundation Certificate: Arabic and Translation Studies Division",
      },
      {
        institution: "Ain Shams University",
        certificate: "Diploma of Higher Studies in Private Law",
      },
      {
        institution: "American Bar Association Rule of Law Initiative and Cairo University",
        certificate: "Continuing Legal Education for Young Lawyers: Skills, Practice and Professional Course",
        date: "January 18 - March 14, 2010, Cairo, Egypt",
      },
    ],
    credentialsAr: [
      {
        institution: "المركز العربي الأوروبي للتحكيم والتدريب",
        certificate: "شهادة: قانون التحكيم المصري في ضوء القوانين الدولية",
        date: "14 ديسمبر 2009 - 18 يناير 2010",
      },
      {
        institution: "الجامعة الأمريكية بالقاهرة، كلية التعليم المستمر",
        certificate: "شهادة تأسيسية: قسم الدراسات العربية والترجمة",
      },
      {
        institution: "جامعة عين شمس",
        certificate: "دبلوم الدراسات العليا في القانون الخاص",
      },
      {
        institution: "مبادرة سيادة القانون التابعة لنقابة المحامين الأمريكية وجامعة القاهرة",
        certificate: "التعليم القانوني المستمر للمحامين الشباب: المهارات والممارسة والدورة المهنية",
        date: "18 يناير - 14 مارس 2010، القاهرة، مصر",
      },
    ],
    phone: " +971 566674666",
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
    casesHandledDisplayEn: "200+",
    casesHandledDisplayAr: "+200",
    casesInProgressEn: "Active criminal and complaint files remain in process across court, police, and authority stages.",
    casesInProgressAr: "لا تزال ملفات جنائية وشكاوى نشطة قيد الإجراء أمام المحاكم والشرطة والجهات المختصة.",
    casesDetailEn:
      "Abdelrahman Mattar has handled more than 200 cases during 7 months of intensive legal practice. His caseload includes breach of trust, cybercrimes, extortion, forgery, theft, assault, drug-related cases, malicious complaints, and issuing cheques in bad faith.",
    casesDetailAr:
      "تولى عبد الرحمن مطر أكثر من 200 قضية خلال 7 أشهر من العمل القانوني المكثف، وتشمل ملفاته خيانة الأمانة والجرائم الإلكترونية والابتزاز والتزوير والسرقة والاعتداء والقضايا المتعلقة بالمخدرات والشكاوى الكيدية وإصدار الشيكات بسوء نية.",
    practiceAreasEn: ["Breach of Trust", "Cybercrimes", "Extortion", "Forgery", "Theft", "Assault", "Drug-Related Cases", "Malicious Complaints", "Bad-Faith Cheques"],
    practiceAreasAr: ["خيانة الأمانة", "الجرائم الإلكترونية", "الابتزاز", "التزوير", "السرقة", "الاعتداء", "قضايا المخدرات", "الشكاوى الكيدية", "الشيكات بسوء نية"],
    highlightsEn: [
      "Handles criminal complaint files from initial review through police, prosecution, and court follow-up.",
      "Supports cases involving breach of trust, forgery, theft, assault, and drug-related allegations.",
      "Works on cybercrime, extortion, malicious complaint, and bad-faith cheque matters.",
    ],
    highlightsAr: [
      "يتولى ملفات الشكاوى الجنائية من المراجعة الأولية حتى المتابعة أمام الشرطة والنيابة والمحاكم.",
      "يدعم القضايا المتعلقة بخيانة الأمانة والتزوير والسرقة والاعتداء والاتهامات المرتبطة بالمخدرات.",
      "يعمل على ملفات الجرائم الإلكترونية والابتزاز والشكاوى الكيدية والشيكات الصادرة بسوء نية.",
    ],
    overviewEn: [
      "Legal Consultant with 7 months of fast-paced practical experience handling a high volume of criminal and complaint-related matters.",
      "He focuses on careful file review, evidence organization, procedural follow-up, and clear client updates at each stage of the case.",
    ],
    overviewAr: [
      "مستشار قانوني لديه 7 أشهر من الخبرة العملية المكثفة في التعامل مع عدد كبير من القضايا الجنائية والملفات المرتبطة بالشكاوى.",
      "يركز على المراجعة الدقيقة للملفات وتنظيم الأدلة والمتابعة الإجرائية وتقديم تحديثات واضحة للعملاء في كل مرحلة من مراحل القضية.",
    ],
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
    casesHandledDisplayEn: "700+",
    casesHandledDisplayAr: "+700",
    casesInProgressEn: "She has completed 1 year with the firm and has achieved an 80% win rate across handled matters.",
    casesInProgressAr: "أكملت سنة واحدة مع المكتب وحققت نسبة فوز 80% في الملفات التي تعاملت معها.",
    casesDetailEn:
      "Dalia Ghonem has handled 700+ cases across labor, civil, commercial, criminal, personal, contract, and agreement-related matters. Her work includes reviewing claims and supporting documents, preparing case files, tracking procedural requirements, and coordinating client updates through each legal stage.",
    casesDetailAr:
      "تولت داليا غنيم أكثر من 700 قضية في مجالات العمل والمدني والتجاري والجنائي والقضايا الشخصية والعقود والاتفاقيات، ويشمل عملها مراجعة المطالبات والمستندات الداعمة وإعداد ملفات القضايا ومتابعة المتطلبات الإجرائية وتنسيق تحديثات العملاء عبر كل مرحلة قانونية.",
    practiceAreasEn: ["Labor Law", "Civil Cases", "Commercial Cases", "Criminal Cases", "Personal Matters", "Contracts", "Agreements"],
    practiceAreasAr: ["قانون العمل", "القضايا المدنية", "القضايا التجارية", "القضايا الجنائية", "القضايا الشخصية", "العقود", "الاتفاقيات"],
    highlightsEn: [
      "Handles labor, civil, commercial, criminal, and personal case files with structured follow-up.",
      "Reviews contracts, agreements, claims, and supporting documents before filing or response.",
      "Tracks hearings, submissions, deadlines, and client updates across active matters.",
      "Maintains an 80% win rate across handled cases.",
    ],
    highlightsAr: [
      "تتولى ملفات العمل والمدني والتجاري والجنائي والقضايا الشخصية بمتابعة منظمة.",
      "تراجع العقود والاتفاقيات والمطالبات والمستندات الداعمة قبل التقديم أو الرد.",
      "تتابع الجلسات والمذكرات والمواعيد النهائية وتحديثات العملاء عبر الملفات النشطة.",
      "تحافظ على نسبة فوز 80% في القضايا التي تعاملت معها.",
    ],
    overviewEn: [
      "Legal Consultant who has completed 1 year with Almahy Legal Services, handling a broad mix of labor, civil, commercial, criminal, personal, contract, and agreement-related matters.",
      "Her profile is focused on disciplined case preparation, practical follow-up, and clear communication from initial review through the next legal step.",
    ],
    overviewAr: [
      "مستشارة قانونية أكملت سنة واحدة مع شركة المحامي للخدمات القانونية، وتتعامل مع مجموعة واسعة من قضايا العمل والمدني والتجاري والجنائي والقضايا الشخصية والعقود والاتفاقيات.",
      "يركز ملفها المهني على الإعداد المنظم للقضايا والمتابعة العملية والحفاظ على تواصل واضح من المراجعة الأولية حتى الخطوة القانونية التالية.",
    ],
    credentialsEn: [
      {
        institution: "Mansoura University",
        certificate: "Faculty of Law",
        date: "2017",
      },
    ],
    credentialsAr: [
      {
        institution: "جامعة المنصورة",
        certificate: "كلية القانون",
        date: "2017",
      },
    ],
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
    casesHandledDisplayEn: "200+",
    casesHandledDisplayAr: "+200",
    casesInProgressEn: "He has completed 4 months with the firm and has achieved a 70% win rate across handled matters.",
    casesInProgressAr: "أكمل 4 أشهر مع المكتب وحقق نسبة فوز 70% في الملفات التي تعامل معها.",
    casesDetailEn:
      "Maged Nafea has handled 200+ cases across labor, civil, commercial, criminal, personal, contract, and agreement-related matters. His work includes preparing case files, reviewing claims and supporting documents, following procedural steps, and coordinating updates until each file reaches the next legal stage.",
    casesDetailAr:
      "تولى مجد نافع أكثر من 200 قضية في مجالات العمل والمدني والتجاري والجنائي والقضايا الشخصية والعقود والاتفاقيات، ويشمل عمله إعداد ملفات القضايا ومراجعة المطالبات والمستندات الداعمة ومتابعة الإجراءات وتنسيق التحديثات حتى انتقال كل ملف إلى مرحلته القانونية التالية.",
    practiceAreasEn: ["Labor Law", "Civil Cases", "Commercial Cases", "Criminal Cases", "Personal Matters", "Contracts", "Agreements"],
    practiceAreasAr: ["قانون العمل", "القضايا المدنية", "القضايا التجارية", "القضايا الجنائية", "القضايا الشخصية", "العقود", "الاتفاقيات"],
    highlightsEn: [
      "Handles labor, civil, commercial, criminal, and personal case files with structured follow-up.",
      "Reviews contracts, agreements, claims, and supporting documents before filing or response.",
      "Tracks hearings, submissions, deadlines, and client updates across active matters.",
      "Maintains a 70% win rate across handled cases.",
    ],
    highlightsAr: [
      "يتولى ملفات العمل والمدني والتجاري والجنائي والقضايا الشخصية بمتابعة منظمة.",
      "يراجع العقود والاتفاقيات والمطالبات والمستندات الداعمة قبل التقديم أو الرد.",
      "يتابع الجلسات والمذكرات والمواعيد النهائية وتحديثات العملاء عبر الملفات النشطة.",
      "يحافظ على نسبة فوز 70% في القضايا التي تعامل معها.",
    ],
    overviewEn: [
      "Legal Consultant who has completed 4 months with Almahy Legal Services, handling a broad mix of labor, civil, commercial, criminal, personal, contract, and agreement-related matters.",
      "His profile is focused on disciplined case preparation, practical follow-up, and maintaining clear communication from initial review through the next legal step.",
    ],
    overviewAr: [
      "مستشار قانوني أكمل 4 أشهر مع شركة المحامي للخدمات القانونية، ويتعامل مع مجموعة واسعة من قضايا العمل والمدني والتجاري والجنائي والقضايا الشخصية والعقود والاتفاقيات.",
      "يركز ملفه المهني على الإعداد المنظم للقضايا والمتابعة العملية والحفاظ على تواصل واضح من المراجعة الأولية حتى الخطوة القانونية التالية.",
    ],
    credentialsEn: [
      {
        institution: "Alexandria University",
        certificate: "Faculty of Law",
        date: "2016",
      },
    ],
    credentialsAr: [
      {
        institution: "جامعة الإسكندرية",
        certificate: "كلية القانون",
        date: "2016",
      },
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
    casesHandledDisplayEn: "4+",
    casesHandledDisplayAr: "+4",
    casesInProgressEn: "Several matters remain in process, which is why his completed case record currently reflects 4 handled cases.",
    casesInProgressAr: "لا تزال عدة ملفات قيد الإجراء، ولذلك يعكس سجل القضايا المكتملة حالياً 4 قضايا تم التعامل معها.",
    casesDetailEn:
      "Kaan Umulu has handled 4 cases directly during his 7 months of legal practice with the firm. Many of his additional files are still in process, including matters awaiting hearings, authority responses, documentation, settlement follow-up, and enforcement steps. His work focuses on debt collection, criminal matters, real estate disputes, and labor law cases.",
    casesDetailAr:
      "تولى كان أومولو 4 قضايا بشكل مباشر خلال 7 أشهر من العمل القانوني مع المكتب، فيما لا تزال العديد من ملفاته الإضافية قيد الإجراء، بما في ذلك ملفات تنتظر الجلسات وردود الجهات والمستندات ومتابعة التسوية وخطوات التنفيذ. يركز عمله على تحصيل الديون والقضايا الجنائية والنزاعات العقارية وقضايا العمل.",
    practiceAreasEn: ["Debt Collection", "Criminal Law", "Real Estate", "Labor Law"],
    practiceAreasAr: ["تحصيل الديون", "القانون الجنائي", "القانون العقاري", "قانون العمل"],
    highlightsEn: [
      "Handles debt collection files from demand notice and settlement follow-up through enforcement support.",
      "Supports criminal matters with document organization, case tracking, and procedural follow-up.",
      "Assists with real estate disputes involving tenancy, property documentation, and claim preparation.",
      "Works on labor law matters involving employment contracts, termination issues, and employee claims.",
    ],
    highlightsAr: [
      "يتولى ملفات تحصيل الديون من مرحلة الإشعار حتى متابعة التنفيذ.",
      "يدعم القضايا الجنائية والعقارية بإعداد المستندات ومتابعة الملف.",
      "يساعد في نزاعات العمل المتعلقة بالعقود وإنهاء الخدمة ومطالبات الموظفين.",
      "يحافظ على متابعة تفصيلية لكل ملف نشط حتى اكتمال الخطوة القانونية التالية.",
    ],
    overviewEn: [
      "Legal Advisor at Almahy Legal Services with 7 months of practical legal work across active client files and court-related follow-up.",
      "He works closely with the team, clients, and relevant authorities to keep each matter organized through clear documentation, timely submissions, and structured case updates.",
    ],
    overviewAr: [
      "مستشار قانوني في شركة المحامي للخدمات القانونية ولديه 7 أشهر من العمل القانوني العملي عبر ملفات عملاء نشطة ومتابعة مرتبطة بالمحاكم.",
      "يعمل عن قرب مع الفريق والعملاء والجهات المختصة للحفاظ على تنظيم كل ملف من خلال توثيق واضح وتقديمات في الوقت المناسب وتحديثات منظمة للقضية.",
    ],
    credentialsEn: [
      {
        institution: "Galatasaray University",
        certificate: "Faculty of Law",
        date: "2018",
      },
    ],
    credentialsAr: [
      {
        institution: "جامعة غلطة سراي",
        certificate: "كلية القانون",
        date: "2018",
      },
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
    casesHandledDisplayEn: "800+",
    casesHandledDisplayAr: "+800",
    casesInProgressEn: "He has completed 7 months with the firm while handling a high-volume caseload across multiple practice areas.",
    casesInProgressAr: "أكمل 7 أشهر مع المكتب أثناء تعامله مع عدد كبير من الملفات عبر مجالات قانونية متعددة.",
    casesDetailEn:
      "Mahmoud Abdel Fadeel has handled 800+ cases across civil, commercial, real estate, labor, cheque, and rental matters. His work includes reviewing claims and supporting documents, preparing case files, tracking hearings and submissions, and coordinating with clients through each procedural stage.",
    casesDetailAr:
      "تولى محمود عبد الفضيل أكثر من 800 قضية في المجالات المدنية والتجارية والعقارية والعمل والشيكات والإيجارات، ويشمل عمله مراجعة المطالبات والمستندات الداعمة وإعداد ملفات القضايا ومتابعة الجلسات والمذكرات والتنسيق مع العملاء خلال كل مرحلة إجرائية.",
    practiceAreasEn: ["Civil Cases", "Commercial Cases", "Real Estate", "Labor Law", "Cheque Cases", "Rental Disputes"],
    practiceAreasAr: ["القضايا المدنية", "القضايا التجارية", "العقارات", "قانون العمل", "قضايا الشيكات", "نزاعات الإيجار"],
    highlightsEn: [
      "Handles civil, commercial, real estate, labor, cheque, and rental case files.",
      "Prepares and follows submissions, hearing updates, and procedural requirements.",
      "Reviews supporting documents and coordinates next steps with clients and the legal team.",
    ],
    highlightsAr: [
      "يتولى ملفات القضايا المدنية والتجارية والعقارية والعمل والشيكات والإيجارات.",
      "يعد ويتابع المذكرات وتحديثات الجلسات والمتطلبات الإجرائية.",
      "يراجع المستندات الداعمة وينسق الخطوات التالية مع العملاء والفريق القانوني.",
    ],
    overviewEn: [
      "Legal Consultant who has completed 7 months with Almahy Legal Services, handling a high-volume caseload across civil, commercial, real estate, labor, cheque, and rental matters.",
      "His work focuses on organized case preparation, procedural follow-up, and clear coordination between clients, courts, and the legal team.",
    ],
    overviewAr: [
      "مستشار قانوني أكمل 7 أشهر مع شركة المحامي للخدمات القانونية، ويتعامل مع عدد كبير من الملفات في المجالات المدنية والتجارية والعقارية والعمل والشيكات والإيجارات.",
      "يركز عمله على الإعداد المنظم للقضايا والمتابعة الإجرائية والتنسيق الواضح بين العملاء والمحاكم والفريق القانوني.",
    ],
    credentialsEn: [
      {
        institution: "Port Said University",
        certificate: "Faculty of Law",
      },
    ],
    credentialsAr: [
      {
        institution: "جامعة بورسعيد",
        certificate: "كلية القانون",
      },
    ],
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
