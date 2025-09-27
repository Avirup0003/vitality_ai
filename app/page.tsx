import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mt-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-heading text-xl mb-2 text-primary">Personalized</h3>
            <p>Ask wellness questions and get safety-first general guidance.</p>
          </div>
          <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-heading text-xl mb-2 text-primary">Fast & Helpful</h3>
            <p>Streaming responses powered by Gemini for a natural chat feel.</p>
          </div>
          <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-heading text-xl mb-2 text-primary">Simple</h3>
            <p>Clean interface with Sign in/Sign out from the navbar.</p>
          </div>
        </div>
      </section>

      <AboutSection />
    </>
  );
}
