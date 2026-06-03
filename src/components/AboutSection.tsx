import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="w-full max-w-[1200px] mx-auto py-16 px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left: Image and testimonial */}
      <div className="flex flex-col items-center">
        <div className="rounded-3xl overflow-hidden shadow-lg mb-6">
          <Image src="/assets/about/about-1.jpg" alt="About Us" width={350} height={420} className="object-cover w-[350px] h-[420px]" />
        </div>
        <blockquote className="text-lg italic text-gray-600 flex items-center gap-3">
          <span className="text-2xl text-yellow-400">&#8220;</span>
          <span>Al Mahy Legal Consultancy provided exceptional support and expertise, guiding us through complex legal matters with professionalism and efficiency. Their dedication and knowledge were invaluable to our success. Highly recommended!</span>
        </blockquote>
      </div>
      {/* Right: About content */}
      <div>
        <div className="mb-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-yellow-700 bg-yellow-100 rounded px-3 py-1">About Us</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">We're Advocates for Justice and Right</h2>
        <p className="text-gray-700 text-base leading-relaxed mb-8">
          AlMahy Legal Services is a premier law firm with over 38 years of legal experience and a global network of 5000 qualified lawyers, making us a trusted name in the legal services industry worldwide. Based in the United Arab Emirates, we have established ourselves as a leading force in the legal sector, providing a diverse range of high-quality legal services to our esteemed clients.
        </p>
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-yellow-700 bg-yellow-100 rounded px-2 py-1 mb-2">Ask a Lawyer</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">We Provide Solid Law Practice</h3>
          </div>
          <div className="flex flex-col gap-2">
            <a href="tel:+971504096028" className="inline-block bg-gray-900 text-white font-bold py-2 px-6 rounded-full text-sm hover:bg-gray-700 transition">Call Us</a>
            <a href="tel:+971504096028" className="inline-block bg-yellow-400 text-gray-900 font-semibold py-2 px-6 rounded-full text-sm">+971 504096028</a>
          </div>
        </div>
      </div>
    </section>
  );
}
