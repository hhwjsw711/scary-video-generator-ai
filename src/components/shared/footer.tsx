function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export const Footer = () => {
  return (
    <footer className="border-t border-purple-700 bg-gray-900 text-purple-200">
      <div className="mx-auto max-w-7xl px-6 pb-0 pt-16">
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-nosifer text-xl text-purple-300">Hivio</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-special text-sm text-purple-300">Docs</span>
            <span className="font-special text-sm text-purple-300">Terms</span>
            <span className="font-special text-sm text-purple-300">
              Privacy
            </span>
            <a
              href="https://x.com/openstory_so"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 transition-colors hover:text-white"
              aria-label="X"
            >
              <XIcon />
            </a>
          </div>
        </div>

        <div className="border-t border-purple-700/50 py-4 text-center">
          <p className="font-special text-sm text-purple-400">
            &copy; {new Date().getFullYear()} Hivio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
