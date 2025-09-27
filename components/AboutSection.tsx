export default function AboutSection() {
  return (
    <section id="about" className="mt-20">
      <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
          {/* Text content */}
          <div className="p-8 md:p-12">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">
              About Vitality AI
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Vitality AI is your friendly wellness companion. Ask about sleep, nutrition,
              stress or exercise and get supportive, safety-first guidance. We’re here to
              inform — not diagnose — and encourage professional care for serious concerns.
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-gray-700 dark:text-gray-300">
                  Fast, streaming answers powered by Gemini.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-gray-700 dark:text-gray-300">
                  Clean, distraction-free UI with dark mode.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-gray-700 dark:text-gray-300">
                  Mark favorite answers and revisit your chat history.
                </p>
              </li>
            </ul>
          </div>

          {/* Illustration */}
          <div className="relative min-h-[350px] md:min-h-[450px] bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/40 dark:to-violet-900/30">
            <img
              src="/images/about-illustration.png"
              alt="About Vitality AI"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          {
            title: 'Wellness Focused',
            img: '/images/wellness-1.png',
            desc: 'Lifestyle guidance — not medical advice.',
          },
          {
            title: 'Streamed Replies',
            img: '/images/wellness-2.png',
            desc: 'Natural, typing-like answers powered by AI.',
          },
          {
            title: 'Favorites & History',
            img: '/images/wellness-3.png',
            desc: 'Save great answers and revisit chats anytime.',
          },
        ].map((c) => (
          <div
            key={c.title}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
          >
            {/* Image wrapper */}
            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={c.img}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Title + Description */}
            <h3 className="font-heading text-xl text-primary mb-1">{c.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
