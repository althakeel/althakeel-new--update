'use client';

import { Locale } from '@/lib/translations';
import { useEffect, useState, useRef } from 'react';

interface StatProps {
  number: string;
  label: string;
  suffix?: string;
}

function StatCard({ number, label, suffix = '' }: StatProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract numeric value from number string (e.g., "52+" -> 52)
  const targetNumber = parseFloat(number.replace(/[^0-9.]/g, ''));
  const hasPlus = number.includes('+');
  const hasPercent = number.includes('%');
  const hasB = number.includes('B');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetNumber / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, targetNumber]);

  const displayValue = () => {
    const numeric = hasB ? count.toFixed(2) : Math.round(count).toLocaleString('en-US');
    let value = hasB ? `${numeric}B` : numeric;
    if (hasPlus) value += '+';
    if (hasPercent) value += '%';
    return value;
  };

  return (
    <div
      ref={cardRef}
      className="relative group transition-transform duration-300 hover:scale-105"
      style={{ minHeight: '200px' }}
    >
      {/* Card Background & Shadow */}
      <div className="absolute inset-0 rounded-xl bg-white/90 shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-gray-200" />
      {/* Accent Bar on Hover */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-400 to-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl" />
      {/* Content */}
      <div className="relative text-center py-14 px-6 flex flex-col items-center justify-center h-full">
        <div
          className="text-2xl md:text-5xl lg:text-7xl font-extrabold mb-4 tracking-tight drop-shadow"
          style={{ fontFamily: 'Georgia, serif', color: '#DE3B34', textShadow: '0 2px 8px rgba(201,162,39,0.10)' }}
        >
          {displayValue()}
        </div>
        <p className="text-xs md:text-base font-semibold uppercase tracking-[0.12em] leading-relaxed max-w-[220px] mx-auto text-gray-800">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function Stats({ locale }: { locale: Locale }) {
  const content = {
    en: {
      badge: "OUR ACHIEVEMENTS",
      title: "We Live & Work Globally",
      stats: [
        {
          number: "15+",
          label: "Years of Experience"
        },
        {
          number: "5000+",
          label: "Cases Won"
        },
        {
          number: "98%",
          label: "Satisfied Clients"
        },
        {
          number: "50+",
          label: "Professional Team Members"
        },
        {
          number: "50,000+",
          label: "Legal Documents Processed"
        },
        {
          number: "25+",
          label: "Countries Served"
        }
      ]
    },
    ar: {
      badge: "إنجازاتنا",
      title: "نعيش ونعمل عالمياً",
      stats: [
        {
          number: "15+",
          label: "سنوات من الخبرة"
        },
        {
          number: "5000+",
          label: "قضية فازت بها"
        },
        {
          number: "98%",
          label: "عملاء راضون"
        },
        {
          number: "50+",
          label: "أعضاء الفريق المحترف"
        },
        {
          number: "50,000+",
          label: "الوثائق القانونية المعالجة"
        },
        {
          number: "25+",
          label: "الدول المخدومة"
        }
      ]
    }
  };

  const pageContent = content[locale];

  return (
    <section
      className="relative w-full py-24 px-4 md:px-8 bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/service/7.webp")' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/82 via-white/88 to-white/95" />
      <div className="relative max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-[2px] w-12 bg-yellow-400" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-yellow-600">
              {pageContent.badge}
            </span>
            <div className="h-[2px] w-12 bg-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 font-bold tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            {pageContent.title}
          </h2>
          <div className="flex justify-center">
            <div className="h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageContent.stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
