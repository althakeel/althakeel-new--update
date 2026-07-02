import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Almahy Legal Services",
  description:
    "Connect with Almahy Legal Services for consultations, appointments, and office location details in Dubai.",
};

const contactChannels = [
  {
    label: "Visit Us",
    title: "Al Saqr Business Tower",
    detail: "Sheikh Zayed Road, Dubai, United Arab Emirates",
    badge: "Head Office",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Call",
    title: "+(971) 5040-96028",
    detail: "Sunday – Thursday, 9:00 AM – 6:00 PM (Gulf Standard Time)",
    badge: "Hotline",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6.5 3h3l1 4-2 .8a10 10 0 0 0 4.2 4.2l.8-2 4 1v3a2 2 0 0 1-2.3 2 16 16 0 0 1-7.7-3.6 16 16 0 0 1-3.6-7.7A2 2 0 0 1 6.5 3Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    title: "contact@almahylegal.com",
    detail: "We respond within one business day for new inquiries.",
    badge: "Support",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6.8c0-.993.0-1.49.194-1.86a1.6 1.6 0 0 1 .696-.696C5.26 4 5.757 4 6.75 4h10.5c.993 0 1.49 0 1.86.244.3.194.502.479.605.802.076.238.076.508.076 1.346v7.416c0 .993 0 1.49-.244 1.86a1.6 1.6 0 0 1-.696.696c-.31.2-.68.244-1.24.257v0l-11.7.019c-.993 0-1.49 0-1.86-.244a1.6 1.6 0 0 1-.696-.696C4 15.23 4 14.734 4 13.74Z" />
        <path d="m5 6 7 5 7-5" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="relative bg-gradient-to-b from-[#160A0A] via-[#160A0A] to-[#160A0A] text-white">
      <div className="absolute inset-0 opacity-50 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 left-10 h-72 w-72 rounded-full bg-[#C9A24B]/30 blur-3xl" />
        <div className="absolute top-10 right-10 h-60 w-60 rounded-full bg-sky-600/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl space-y-4 text-balance">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A24B] ring-1 ring-white/10">Contact</span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                Let&apos;s discuss your legal needs.
              </h1>
              <p className="max-w-3xl text-base text-white/80 sm:text-lg">
                Reach our team for consultations, document reviews, and time-sensitive matters. We blend responsive service with precise legal guidance for clients in Dubai and abroad.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/75">
              <span className="rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">Appointments by booking</span>
              <span className="rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">Secure document exchange</span>
              <span className="rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">Virtual consultations available</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 shadow-lg shadow-black/20 backdrop-blur sm:max-w-sm">
            <p className="text-sm text-white/80">Office Hours</p>
            <p className="text-2xl font-semibold text-white">Sun – Thu</p>
            <p className="text-sm text-white/70">9:00 AM – 6:00 PM (GST)</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/80">
              <div>
                <p className="text-xs uppercase text-white/60">Walk-ins</p>
                <p className="font-semibold">By appointment</p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/60">Response</p>
                <p className="font-semibold">Within 1 business day</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/15 backdrop-blur xl:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#C9A24B]">Send us a message</p>
                <p className="text-lg font-semibold text-white">We&apos;ll get back within one business day.</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-500/40">
                Secure form
              </span>
            </div>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Contact form">
              <label className="space-y-1 text-sm font-medium text-white/80">
                Full name
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#C9A24B] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50"
                  required
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-white/80">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#C9A24B] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50"
                  required
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-white/80">
                Phone
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +971 50 123 4567"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#C9A24B] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-white/80">
                Topic
                <select
                  name="topic"
                  className="w-full rounded-xl border border-white/20 bg-[#160A0A] px-4 py-3 text-white shadow-inner shadow-black/30 focus:border-[#C9A24B] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50"
                  defaultValue="consultation"
                >
                  <option value="consultation" style={{ color: "#160A0A", backgroundColor: "#f8fafc" }}>
                    Consultation
                  </option>
                  <option value="case" style={{ color: "#160A0A", backgroundColor: "#f8fafc" }}>
                    Case review
                  </option>
                  <option value="corporate" style={{ color: "#160A0A", backgroundColor: "#f8fafc" }}>
                    Corporate services
                  </option>
                  <option value="litigation" style={{ color: "#160A0A", backgroundColor: "#f8fafc" }}>
                    Litigation support
                  </option>
                  <option value="other" style={{ color: "#160A0A", backgroundColor: "#f8fafc" }}>
                    Other
                  </option>
                </select>
              </label>
              <label className="md:col-span-2 space-y-1 text-sm font-medium text-white/80">
                How can we help?
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Share a brief summary of your matter, including timelines."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#C9A24B] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50"
                  required
                />
              </label>
              <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-white/70">
                  By submitting, you confirm the details are correct. We keep your information confidential.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A24B] px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-[#C9A24B]/30 transition hover:translate-y-[-1px] hover:bg-[#E6C878] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#160A0A] focus:ring-[#C9A24B]"
                >
                  Send message
                  <span aria-hidden className="text-lg">→</span>
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-4 pt-4">
              {contactChannels.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/12 bg-[#160A0A] px-5 py-5 text-sm text-white/85 shadow-[0_18px_45px_-24px_rgba(0,0,0,0.9)] flex items-start gap-4"
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/10 text-[#C9A24B] ring-1 ring-white/12">
                    {item.icon}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">{item.label}</span>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-[#C9A24B] ring-1 ring-white/12">{item.badge}</span>
                    </div>
                    <p className="text-lg font-semibold text-white leading-snug break-words tracking-tight">{item.title}</p>
                    <p className="text-sm text-white/78 leading-relaxed break-words">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
                <div>
                  <p className="text-sm font-semibold text-[#C9A24B]">Dubai Office</p>
                  <p className="text-lg font-semibold text-white">Al Saqr Business Tower</p>
                  <p className="text-sm text-white/70">Sheikh Zayed Rd, Trade Centre 1, Dubai</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15">
                  View on map
                </span>
              </div>
              <div className="mt-4 aspect-[4/3] w-full">
                <iframe
                  title="Al Saqr Business Tower location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d115509.89372459274!2d55.278055!3d25.213871!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f428c4b20d9c1%3A0xda2a93cfee3dee03!2sAl%20Saqr%20Business%20Tower!5e0!3m2!1sen!2sus!4v1768997496305!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
