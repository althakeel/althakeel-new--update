import { translations, Locale } from "@/lib/translations";
import { teamMembers } from "@/lib/teamMembers";
import Link from "next/link";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValidLoc = locale === "en" || locale === "ar";
  const lang = isValidLoc ? (locale as Locale) : "en";
  const t = translations[lang];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center px-4">
          <p className="font-semibold mb-2 tracking-wider uppercase text-sm" style={{color: '#DE3B34'}}>
            {lang === 'en' ? 'Driven by Precision, Built on Trust' : 'مدفوعون بالدقة، مبنيون على الثقة'}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {lang === 'en' ? 'About us' : 'من نحن'}
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {lang === 'en' ? 'Home / About us' : 'الرئيسية / من نحن'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href={`/${lang}/contact`}
              className="text-gray-900 font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              style={{backgroundColor: '#DE3B34'}}
            >
              📅 {lang === 'en' ? 'Book Free Consultation' : 'احجز استشارة مجانية'}
            </Link>
            <a 
              href="tel:+971504096028"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2"
            >
              📞 {lang === 'en' ? 'Call Us' : 'اتصل بنا'}
            </a>
          </div>
        </div>
      </div>

      {/* Main About Section */}
      <div className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="font-semibold mb-3 tracking-wide uppercase text-sm" style={{color: '#FFB6B6'}}>
                {lang === 'en' ? 'Welcome To Our Law Associates' : 'مرحبا بكم في شركة المحاماة'}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {lang === 'en' ? 'Make your tax compliance the starting point for growing your business' : 'اجعل امتثالك الضريبي نقطة البداية لنمو عمل'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {t.aboutDesc1}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {t.aboutDesc2}
              </p>
              
              {/* Core Values */}
              <div className="space-y-3 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {lang === 'en' ? 'Our Core Values' : 'قيمنا الأساسية'}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#DE3B34'}}></div>
                  <p className="text-gray-700 font-medium">{lang === 'en' ? 'Committed to delivering the finest' : 'ملتزمون بتقديم الأفضل'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#DE3B34'}}></div>
                  <p className="text-gray-700 font-medium">{lang === 'en' ? 'Honest and transparent services' : 'خدمات صادقة وشفافة'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#DE3B34'}}></div>
                  <p className="text-gray-700 font-medium">{lang === 'en' ? 'High marks of trust, business trust & integrity' : 'ثقة عالية ونزاهة'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#DE3B34'}}></div>
                  <p className="text-gray-700 font-medium">{lang === 'en' ? 'Service' : 'خدمة'}</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800" 
                  alt="Team meeting" 
                  className="w-full h-[600px] object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-2xl -z-10" style={{backgroundColor: '#DE3B34'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800" 
                  alt="Professional workspace" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-2xl -z-10" style={{backgroundColor: '#CECDCB'}}></div>
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2">
              {/* Mission */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{backgroundColor: 'rgba(248, 228, 139, 0.2)'}}>
                    🎯
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {t.missionTitle}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg pl-20">
                  {t.missionDesc}
                </p>
              </div>

              {/* Vision */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{backgroundColor: 'rgba(191, 156, 74, 0.2)'}}>
                    👁️
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {t.visionTitle}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg pl-20">
                  {t.visionDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.whyChooseTitle}
            </h2>
            <div className="flex justify-center">
              <div className="h-1 w-24 rounded" style={{backgroundColor: '#DE3B34'}}></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6" style={{backgroundColor: '#DE3B34'}}>
                ⚖️
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">{t.why1Title}</h4>
              <p className="text-gray-600 leading-relaxed">{t.why1Desc}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6" style={{backgroundColor: '#DE3B34'}}>
                🌍
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">{t.why2Title}</h4>
              <p className="text-gray-600 leading-relaxed">{t.why2Desc}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6" style={{backgroundColor: '#DE3B34'}}>
                💼
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">{t.why3Title}</h4>
              <p className="text-gray-600 leading-relaxed">{t.why3Desc}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6" style={{backgroundColor: '#DE3B34'}}>
                🤝
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">{t.why4Title}</h4>
              <p className="text-gray-600 leading-relaxed">{t.why4Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <p className="font-semibold tracking-[0.16em] uppercase text-xs mb-3" style={{color: '#CECDCB'}}>
              {lang === 'en' ? 'Professional Experts' : 'خبراء محترفون'}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {lang === 'en' ? 'Our Team' : 'فريقنا'}
            </h2>
            <div className="flex justify-center">
              <div className="h-[3px] w-20 rounded-full" style={{backgroundColor: '#DE3B34'}}></div>
            </div>
            <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              {lang === 'en' ? 'Meet our dedicated staff who drive our success.' : 'تعرف على فريق العمل المتميز لدينا.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Link
                key={member.slug}
                href={`/${lang}/about/team/${member.slug}`}
                className="group relative block h-[380px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)] hover:-translate-y-1 hover:shadow-[0_18px_32px_-18px_rgba(15,23,42,0.45)] transition-all duration-300"
              >
                <img
                  src={member.photo}
                  alt={lang === "ar" ? member.nameAr : member.nameEn}
                  className="h-full w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-black/35 backdrop-blur-sm px-4 py-3 text-center">
                  <h4 className={`text-white text-[28px] font-bold leading-[1.12] tracking-[-0.015em] ${lang === "en" ? "uppercase" : ""}`}>
                    {lang === "ar" ? member.nameAr : member.nameEn}
                  </h4>
                  <p className={`mt-1 text-xs uppercase tracking-[0.12em] font-medium text-white/80 ${lang === "ar" ? "normal-case" : ""}`}>
                    {lang === "ar" ? member.positionAr : member.positionEn}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 md:px-8 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {lang === 'en' ? 'Ready to Get Started?' : 'هل أنت مستعد للبدء؟'}
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            {lang === 'en' ? 'Contact us today for a free consultation and discover how we can help your business succeed.' : 'اتصل بنا اليوم للحصول على استشارة مجانية واكتشف كيف يمكننا مساعدة عملك على النجاح.'}
          </p>
          <Link 
            href={`/${lang}/contact`}
            className="inline-block text-gray-900 font-bold px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-xl text-lg"
            style={{backgroundColor: '#DE3B34'}}
          >
            {lang === 'en' ? 'CONNECT WITH US!' : 'تواصل معنا!'}
          </Link>
        </div>
      </div>
    </div>
  );
}
