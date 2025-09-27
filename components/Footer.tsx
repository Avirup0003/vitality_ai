export default function Footer() {
  return (
    <footer className="mt-16 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p>© {new Date().getFullYear()} Vitality AI • General info only — not medical advice.</p>
      </div>
    </footer>
  );
}
