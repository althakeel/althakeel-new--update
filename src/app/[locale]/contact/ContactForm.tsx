"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { translations, Locale } from "@/lib/translations";
import { countries, DEFAULT_COUNTRY, type Country } from "@/lib/countries";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#C9A24B] focus:bg-white/[0.06]";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ lang }: { lang: Locale }) {
  const t = translations[lang];
  const isAr = lang === "ar";

  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [topicOpen, setTopicOpen] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);

  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso2.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const copy = {
    topicLabel: isAr ? "الموضوع" : "Topic",
    topics: isAr
      ? ["استشارة", "مراجعة قضية", "خدمات الشركات", "دعم التقاضي", "أخرى"]
      : ["Consultation", "Case review", "Corporate services", "Litigation support", "Other"],
    replyNote: isAr ? "سنرد عليك خلال يوم عمل واحد." : "We'll get back within one business day.",
    confidential: isAr
      ? "بالإرسال، أنت تؤكد صحة البيانات. نحافظ على سرية معلوماتك."
      : "By submitting, you confirm the details are correct. We keep your information confidential.",
    sending: isAr ? "جارٍ الإرسال..." : "Sending...",
    success: isAr
      ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا."
      : "Your message has been sent! We'll be in touch soon.",
    errorGeneric: isAr
      ? "تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى."
      : "We couldn't send your message. Please try again.",
  };

  const [topic, setTopic] = useState(copy.topics[0]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (topicRef.current && !topicRef.current.contains(e.target as Node)) {
        setTopicOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const rawNumber = String(data.get("phoneNumber") || "").trim();
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: rawNumber ? `${country.dial} ${rawNumber}` : "",
      topic: String(data.get("topic") || ""),
      message: String(data.get("message") || ""),
    };

    setStatus("sending");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json?.success) {
        setStatus("success");
        setFeedback(copy.success);
        form.reset();
        setTopic(copy.topics[0]);
        setCountry(DEFAULT_COUNTRY);
      } else {
        setStatus("error");
        setFeedback(json?.message || copy.errorGeneric);
      }
    } catch {
      setStatus("error");
      setFeedback(copy.errorGeneric);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">{t.sendMessage}</h2>
        <p className="mt-1.5 text-sm text-white/60">{copy.replyNote}</p>
      </div>

      <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit} aria-label="Contact form">
        <label className="space-y-1.5 text-sm font-medium text-white/80">
          {t.formName}
          <input type="text" name="name" placeholder={t.formNamePlaceholder} className={inputClass} required />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-white/80">
          {t.formEmail}
          <input type="email" name="email" placeholder={t.formEmailPlaceholder} className={inputClass} required />
        </label>
        <div className="space-y-1.5 text-sm font-medium text-white/80">
          <span>{t.formPhone}</span>
          <div className="flex gap-2">
            <div className="relative" ref={countryRef}>
              <button
                type="button"
                onClick={() => setCountryOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={countryOpen}
                className={`flex h-full items-center gap-1.5 rounded-lg border bg-white/[0.04] px-3 py-3 text-white outline-none transition hover:bg-white/[0.06] ${
                  countryOpen ? "border-[#C9A24B]" : "border-white/10"
                }`}
              >
                <span className="text-sm">{country.dial}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-3.5 w-3.5 flex-none text-white/50 transition-transform ${countryOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {countryOpen && (
                <div className="absolute z-30 mt-2 w-72 max-w-[80vw] overflow-hidden rounded-lg border border-white/10 bg-[#1f1010] shadow-2xl shadow-black/50">
                  <div className="p-2">
                    <input
                      type="text"
                      autoFocus
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder={isAr ? "ابحث عن دولة..." : "Search country..."}
                      className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                  <ul role="listbox" className="max-h-60 overflow-y-auto p-1 pt-0">
                    {filteredCountries.map((c) => {
                      const active = c.iso2 === country.iso2;
                      return (
                        <li key={c.iso2} role="option" aria-selected={active}>
                          <button
                            type="button"
                            onClick={() => {
                              setCountry(c);
                              setCountryOpen(false);
                              setCountrySearch("");
                            }}
                            className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition ${
                              active ? "bg-[#C9A24B]/15 text-white" : "text-white/80 hover:bg-white/5"
                            }`}
                          >
                            <span className="flex-1 truncate">{c.name}</span>
                            <span className="text-white/50">{c.dial}</span>
                          </button>
                        </li>
                      );
                    })}
                    {filteredCountries.length === 0 && (
                      <li className="px-3 py-3 text-center text-sm text-white/40">
                        {isAr ? "لا توجد نتائج" : "No results"}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <input
              type="tel"
              name="phoneNumber"
              placeholder={isAr ? "50 123 4567" : "50 123 4567"}
              className={`${inputClass} flex-1`}
            />
          </div>
        </div>
        <div className="space-y-1.5 text-sm font-medium text-white/80">
          <span>{copy.topicLabel}</span>
          <input type="hidden" name="topic" value={topic} />
          <div className="relative" ref={topicRef}>
            <button
              type="button"
              onClick={() => setTopicOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={topicOpen}
              className={`flex w-full items-center justify-between rounded-lg border bg-white/[0.04] px-4 py-3 text-left text-white outline-none transition hover:bg-white/[0.06] ${
                topicOpen ? "border-[#C9A24B]" : "border-white/10"
              }`}
            >
              <span>{topic}</span>
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 flex-none text-white/50 transition-transform ${topicOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {topicOpen && (
              <ul
                role="listbox"
                className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-[#1f1010] p-1 shadow-2xl shadow-black/50"
              >
                {copy.topics.map((option) => {
                  const active = option === topic;
                  return (
                    <li key={option} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => {
                          setTopic(option);
                          setTopicOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                          active ? "bg-[#C9A24B]/15 text-white" : "text-white/80 hover:bg-white/5"
                        }`}
                      >
                        {option}
                        {active && (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#C9A24B]" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <label className="space-y-1.5 text-sm font-medium text-white/80 md:col-span-2">
          {t.formMessage}
          <textarea
            name="message"
            rows={5}
            placeholder={t.formMessagePlaceholder}
            className={`${inputClass} resize-none`}
            required
          />
        </label>

        {feedback && (
          <div
            role="status"
            className={`md:col-span-2 rounded-xl px-4 py-3 text-sm ring-1 ${
              status === "success"
                ? "bg-emerald-500/15 text-emerald-100 ring-emerald-500/40"
                : "bg-[#C9A24B]/15 text-[#E6C878] ring-[#C9A24B]/40"
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xs text-xs leading-relaxed text-white/50">{copy.confidential}</p>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A24B] px-8 py-3 text-sm font-semibold text-[#160A0A] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:ring-offset-2 focus:ring-offset-[#160A0A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? copy.sending : t.formSubmit}
            {status !== "sending" && (
              <span aria-hidden>{isAr ? "←" : "→"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
