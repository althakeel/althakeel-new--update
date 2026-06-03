"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/translations';
import { BlogPost, loadBlogBySlugFromServer } from '@/lib/blogs';

export default function BlogDetailsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const slug = (params?.slug as string) || '';
  const lang: Locale = locale === 'ar' ? 'ar' : 'en';
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      const serverBlog = await loadBlogBySlugFromServer(slug);
      setBlog(serverBlog);
    };

    void loadBlog();
  }, [slug]);

  const text = useMemo(
    () => ({
      back: lang === 'ar' ? 'الرجوع إلى المدونة' : 'Back to Blogs',
      notFound: lang === 'ar' ? 'المقالة غير موجودة.' : 'Blog not found.',
    }),
    [lang]
  );

  const bannerImage =
    lang === 'ar'
      ? blog?.bannerImageAr || blog?.bannerImage || blog?.imageAr || blog?.image || ''
      : blog?.bannerImage || blog?.image || '';
  const title = lang === 'ar' ? blog?.titleAr || blog?.title || '' : blog?.title || '';
  const shortDescription =
    lang === 'ar' ? blog?.shortDescriptionAr || blog?.shortDescription || '' : blog?.shortDescription || '';
  const content = lang === 'ar' ? blog?.contentAr || blog?.content || '' : blog?.content || '';

  return (
    <main className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* ── Full-width Hero ── */}
      <div className="relative w-full min-h-[42vh] sm:min-h-[48vh] md:min-h-[56vh] lg:min-h-[62vh] overflow-hidden bg-[#160A0A]">
        {bannerImage && (
          <img
            src={bannerImage}
            alt={title}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#160A0A] via-[#160A0A]/40 to-transparent" />

        {/* Navbar spacer + centered meta */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 md:pb-16 px-6 md:px-10 text-center">
          {blog && (
            <>
              <span className="inline-block text-[10px] tracking-[0.3em] uppercase font-bold text-[#DE3B34] mb-4">
                Legal Blog &nbsp;·&nbsp; {blog.date}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] max-w-4xl">
                {title}
              </h1>
            </>
          )}
        </div>
      </div>

      {/* ── Article ── */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-20">

        {/* Back */}
        <Link
          href={`/${locale}/blogs`}
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#DE3B34] hover:text-[#9B0F09] transition-colors mb-12"
        >
          <span className="text-base leading-none">{lang === 'ar' ? '→' : '←'}</span>
          {text.back}
        </Link>

        {!blog ? (
          <p className="text-slate-500">{text.notFound}</p>
        ) : (
          <article>
            {/* Title for no-banner fallback */}
            {!bannerImage && (
              <div className="mb-10">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#DE3B34]">
                  {blog.date}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#160A0A] leading-tight mt-3">
                  {title}
                </h1>
              </div>
            )}

            {/* Lead / short description */}
            <p className="text-xl md:text-2xl font-semibold text-[#160A0A] leading-relaxed mb-10">
              {shortDescription}
            </p>

            {/* Red rule */}
            <div className="w-16 h-[3px] bg-[#DE3B34] mb-10" />

            {/* Body content */}
            <div className="prose prose-slate max-w-none text-[17px] leading-[1.85] text-slate-700 whitespace-pre-line">
              {content}
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
