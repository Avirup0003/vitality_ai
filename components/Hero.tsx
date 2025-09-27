import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-gradientStart to-brand-gradientEnd text-white shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
        <div className="md:w-1/2">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Discover Your Personalized Wellness Journey
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-95">
            Ask about sleep, nutrition, fitness or stress — get fast, friendly guidance.
          </p>

          <div className="flex gap-3">
            <Link href="/chat" className="rounded-xl bg-white text-primary px-5 py-3 font-medium hover:bg-white/90">
              Start Chat
            </Link>
            <a href="#about" className="rounded-xl border border-white/40 px-5 py-3 font-medium hover:bg-white/10">
              Learn more
            </a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/hero-image.png"
            alt="Healthy lifestyle"
            width={520}
            height={380}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
