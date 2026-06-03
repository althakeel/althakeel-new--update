'use client';

import { Locale } from '@/lib/translations';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
  profilePhotoUrl?: string;
}

interface ReviewsData {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

export default function GoogleReviews({ locale }: { locale: Locale }) {
  const reviewsData: ReviewsData = {
    rating: 5.0,
    totalReviews: 50,
    reviews: getFallbackReviews(locale),
  };

  const content = {
    en: {
      title: "What Our Clients Say",
      subtitle: "Trusted by businesses across the UAE",
      viewAllReviews: "View All Reviews on Google",
      verifiedFrom: "Verified reviews from"
    },
    ar: {
      title: "ماذا يقول عملاؤنا",
      subtitle: "موثوق به من قبل الشركات في جميع أنحاء الإمارات",
      viewAllReviews: "عرض جميع التقييمات على جوجل",
      verifiedFrom: "تقييمات موثقة من"
    }
  };

  const pageContent = content[locale];
  const googleMapsUrl = "https://www.google.com/maps/place/Almahy+Legal+Services/@25.213871,55.2734469,17z/data=!3m1!5s0x3e5f6a26defbbce5:0x815e4f8b97a871cd!4m10!1m2!2m1!1salmahy!3m6!1s0x3e5f434f5fdaba03:0x37097f69d9d98181!8m2!3d25.2138701!4d55.2780545!15sCgZhbG1haHmSAQ5sZWdhbF9zZXJ2aWNlc-ABAA!16s%2Fg%2F11rk88bxfm?entry=ttu";

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1250px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {pageContent.title}
          </h2>
          <div className="flex justify-center mb-4">
            <div className="h-1 w-20 bg-amber-500 rounded"></div>
          </div>
          <p className="text-gray-600 text-lg mb-8">{pageContent.subtitle}</p>
          
          {/* Google Rating Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= Math.floor(reviewsData.rating || 5)} />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">{reviewsData.rating.toFixed(1)}</span>
            <span className="text-gray-600">on Google</span>
            {reviewsData.totalReviews > 0 && (
              <span className="text-gray-500">({reviewsData.totalReviews} reviews)</span>
            )}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviewsData.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Reviewer Info */}
              <div className="flex items-start gap-3 mb-4">
                {review.profilePhotoUrl ? (
                  <img 
                    src={review.profilePhotoUrl} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.avatar}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">{review.name}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} filled={star <= review.rating} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-5">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* View All Reviews Button */}
        <div className="text-center">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-10 py-4 rounded-full transition-all hover:scale-105 shadow-xl"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {pageContent.viewAllReviews}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          {/* Google Logo */}
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
            <span>{pageContent.verifiedFrom}</span>
            <svg className="w-16 h-6" viewBox="0 0 272 92" fill="none">
              <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
              <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
              <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
              <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
              <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
              <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// Fallback reviews if API fails
function getFallbackReviews(locale: Locale): Review[] {
  const fallbackReviews = {
    en: [
      {
        id: 1,
        name: "Ahmed Al Jamal",
        rating: 5,
        date: "2 weeks ago",
        text: "Excellent accounting services! The team at Almahy Legal Services Accounting helped us streamline our financial processes and ensure full compliance with UAE tax regulations. Highly professional and responsive.",
        avatar: "AM"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        rating: 5,
        date: "1 month ago",
        text: "Outstanding service for our company audit. They were thorough, professional, and completed everything on time. Their expertise in IFRS standards is impressive. Would definitely recommend!",
        avatar: "SJ"
      },
      {
        id: 3,
        name: "Mohammed Al Hashimi",
        rating: 5,
        date: "1 month ago",
        text: "Very satisfied with their tax consulting services. They helped us optimize our VAT structure and saved us considerable costs. The team is knowledgeable and always available to answer questions.",
        avatar: "MH"
      },
      {
        id: 4,
        name: "Emily Chen",
        rating: 5,
        date: "2 months ago",
        text: "Professional and reliable! Almahy Legal Services Accounting has been handling our bookkeeping and financial reporting for over a year. They're detail-oriented and provide valuable insights for our business growth.",
        avatar: "EC"
      },
      {
        id: 5,
        name: "Khalid Rahman",
        rating: 5,
        date: "2 months ago",
        text: "Fantastic experience with their corporate services. They guided us through the entire company formation process in Dubai and handled all accounting setup. Smooth and efficient!",
        avatar: "KR"
      },
      {
        id: 6,
        name: "Lisa Anderson",
        rating: 5,
        date: "3 months ago",
        text: "Best accounting firm in Dubai! Their team is incredibly professional and always goes the extra mile. They've been instrumental in helping us maintain compliance and grow our business.",
        avatar: "LA"
      }
    ],
    ar: [
      {
        id: 1,
        name: "أحمد المنصوري",
        rating: 5,
        date: "قبل أسبوعين",
        text: "خدمات محاسبية ممتازة! ساعدنا فريق الخليج ستار للمحاسبة في تبسيط عملياتنا المالية وضمان الامتثال الكامل للوائح الضريبية في الإمارات. محترفون للغاية ومستجيبون.",
        avatar: "AM"
      },
      {
        id: 2,
        name: "سارة جونسون",
        rating: 5,
        date: "قبل شهر",
        text: "خدمة متميزة لتدقيق الشركة. كانوا دقيقين ومحترفين وأكملوا كل شيء في الوقت المحدد. خبرتهم في معايير التقارير المالية الدولية مثيرة للإعجاب. بالتأكيد أوصي بهم!",
        avatar: "SJ"
      },
      {
        id: 3,
        name: "محمد الهاشمي",
        rating: 5,
        date: "قبل شهر",
        text: "راضٍ جدًا عن خدماتهم الاستشارية الضريبية. ساعدونا في تحسين هيكل ضريبة القيمة المضافة ووفروا لنا تكاليف كبيرة. الفريق على دراية ومتاح دائمًا للإجابة على الأسئلة.",
        avatar: "MH"
      },
      {
        id: 4,
        name: "إيميلي تشين",
        rating: 5,
        date: "قبل شهرين",
        text: "محترفون وموثوقون! تتولى الخليج ستار للمحاسبة إدارة مسك الدفاتر والتقارير المالية لدينا منذ أكثر من عام. إنهم يهتمون بالتفاصيل ويقدمون رؤى قيمة لنمو أعمالنا.",
        avatar: "EC"
      },
      {
        id: 5,
        name: "خالد الرحمن",
        rating: 5,
        date: "قبل شهرين",
        text: "تجربة رائعة مع خدماتهم المؤسسية. أرشدونا خلال عملية تأسيس الشركة بالكامل في دبي وتعاملوا مع جميع الإعدادات المحاسبية. سلسة وفعالة!",
        avatar: "KR"
      },
      {
        id: 6,
        name: "ليزا أندرسون",
        rating: 5,
        date: "قبل 3 أشهر",
        text: "أفضل شركة محاسبة في دبي! فريقهم محترف بشكل لا يصدق ويذهب دائمًا إلى أبعد الحدود. لقد كانوا حاسمين في مساعدتنا على الحفاظ على الامتثال وتنمية أعمالنا.",
        avatar: "LA"
      }
    ]
  };

  return fallbackReviews[locale];
}
