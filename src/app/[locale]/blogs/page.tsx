"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/translations';
import {
  BlogPost,
  loadBlogsFromServer,
  loadBlogsPageBannerConfigFromServer,
} from '@/lib/blogs';

export default function BlogsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const lang: Locale = locale === 'ar' ? 'ar' : 'en';
  const isRTL = lang === 'ar';
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogsPageBanner, setBlogsPageBanner] = useState('');
  const [bannerCardTitle, setBannerCardTitle] = useState('');
  const [bannerCardSub, setBannerCardSub] = useState('');
  const fallbackBanner = '/assets/banner/DB1.webp';

  useEffect(() => {
    const loadServerData = async () => {
      setIsLoading(true);
      try {
        const [serverBlogs, bannerConfig] = await Promise.all([
          loadBlogsFromServer(),
          loadBlogsPageBannerConfigFromServer(),
        ]);

        setBlogs(serverBlogs);
        setBlogsPageBanner(bannerConfig.bannerUrl);
        setBannerCardTitle(lang === 'ar' ? bannerConfig.card.titleAr : bannerConfig.card.titleEn);
        setBannerCardSub(lang === 'ar' ? bannerConfig.card.subAr : bannerConfig.card.subEn);
      } finally {
        setIsLoading(false);
      }
    };

    void loadServerData();
  }, [lang]);

  const tx = useMemo(() => ({
    label:    lang === 'ar' ? 'تصفح وتابع آخر المستجدات' : 'Browse and read the latest stuff',
    heading:  lang === 'ar' ? 'أحدث القصص' : 'Latest Stories',
    noBlogs:  lang === 'ar' ? 'لا توجد مقالات منشورة بعد.' : 'No articles published yet.',
    readMore: lang === 'ar' ? 'اقرأ المزيد' : 'Read more',
    bannerTitle: lang === 'ar' ? 'المدونة القانونية' : 'Legal Blog',
    bannerSub: lang === 'ar' ? 'مقالات قانونية حديثة من فريقنا.' : 'Latest legal articles from our team.',
    morePosts: lang === 'ar' ? 'المزيد من المقالات' : 'More Posts',
  }), [lang]);

  const effectiveBanner = blogsPageBanner || fallbackBanner;

  return (
    <main className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: 'Montserrat, sans-serif' }}>

      {/* ── Independent Blogs Page Banner ── */}
      <div className="relative w-full bg-[#1a1a1a] overflow-hidden" style={{ minHeight: 390 }}>
        {/* Background image */}
        <img
          src={effectiveBanner}
          alt={tx.bannerTitle}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        {/* Card overlay */}
        <div
          className={`relative z-10 flex items-end ${isRTL ? 'justify-start md:justify-end' : 'justify-start'}`}
          style={{ minHeight: 390 }}
        >
          <div
            className={`m-5 md:m-12 w-[min(92%,560px)] rounded-2xl border border-white/30 bg-white/20 p-6 md:p-8 shadow-2xl backdrop-blur-md ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <div className={`mb-4 flex items-center gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <span className="inline-block h-[3px] w-8 bg-[#DE3B34]" />
              <p className="text-[10px] tracking-[0.22em] uppercase font-bold text-white/80">
                {tx.label}
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
              {bannerCardTitle || tx.bannerTitle}
            </h2>
            <p className="text-sm md:text-base text-white/85 leading-relaxed line-clamp-3">
              {bannerCardSub || tx.bannerSub}
            </p>
          </div>
        </div>
      </div>

      {/* ── Grid Section ── */}
      <section className="max-w-[1250px] mx-auto px-4 md:px-8 pt-20 pb-24 mt-8">

        {/* Section label + heading */}
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#DE3B34] mb-1">{tx.label}</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#160A0A] mb-10">{tx.heading}</h2>

        {!isLoading && blogs.length === 0 && (
          <p className="text-slate-400 text-sm">{tx.noBlogs}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {isLoading && Array.from({ length: 6 }).map((_, index) => (
            <article key={`skeleton-${index}`} className="flex flex-col overflow-hidden rounded-sm border border-slate-200/80 animate-pulse">
              <div className="w-full h-52 bg-slate-200" />
              <div className="pt-4 px-5 pb-5">
                <div className="h-5 w-[88%] bg-slate-200 rounded mb-2" />
                <div className="h-5 w-[70%] bg-slate-200 rounded mb-4" />
                <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
                <div className="w-8 h-0.5 bg-slate-200 mb-4" />
                <div className="h-3 w-full bg-slate-200 rounded mb-2" />
                <div className="h-3 w-[95%] bg-slate-200 rounded mb-2" />
                <div className="h-3 w-[80%] bg-slate-200 rounded mb-5" />
                <div className="h-3 w-28 bg-slate-200 rounded" />
              </div>
            </article>
          ))}

          {blogs.map((blog) => (
            <article key={blog.id} className="flex flex-col group shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-sm">
              {(() => {
                const cardImage = lang === 'ar' ? blog.imageAr || blog.image : blog.image;
                const cardTitle = lang === 'ar' ? blog.titleAr || blog.title : blog.title;
                const cardShortDescription = lang === 'ar' ? blog.shortDescriptionAr || blog.shortDescription : blog.shortDescription;

                return (
                  <>
              {/* Image */}
              <Link href={`/${locale}/blogs/${blog.slug}`} className="block overflow-hidden">
                <img
                  src={cardImage}
                  alt={cardTitle}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="pt-4 px-5 pb-5">
              {/* Title */}
              <Link href={`/${locale}/blogs/${blog.slug}`}>
                <h3 className="text-base font-extrabold text-[#160A0A] leading-snug mb-2 group-hover:text-[#DE3B34] transition-colors line-clamp-2">
                  {cardTitle}
                </h3>
              </Link>
              {/* Meta */}
              <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mb-3">
                {blog.date}
              </p>
              {/* Red divider */}
              <div className="w-8 h-0.5 bg-[#DE3B34] mb-3" />
              {/* Excerpt */}
              <p className="text-sm text-slate-500 line-clamp-3 flex-1 mb-4">{cardShortDescription}</p>
              {/* Read more */}
              <Link
                href={`/${locale}/blogs/${blog.slug}`}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#DE3B34] hover:gap-3 transition-all"
              >
                {tx.readMore}
                <span className="text-sm leading-none">{isRTL ? '←' : '→'}</span>
              </Link>
              </div>
                  </>
                );
              })()}
            </article>
          ))}
        </div>

        {/* More Posts button */}
        {!isLoading && blogs.length > 0 && (
          <div className="flex justify-center mt-14">
            <button
              className="px-10 py-3 bg-[#DE3B34] text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#9B0F09] transition-colors"
            >
              {tx.morePosts}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

