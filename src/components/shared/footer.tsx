import Link from "next/link";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export const Footer = () => {
  return (
    <footer className="border-t border-purple-700 text-purple-200">
      <div className="mx-auto max-w-7xl px-6 pb-0 pt-16">
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-nosifer text-xl text-purple-300">
              Wordream
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="font-special text-sm text-purple-300 transition-colors hover:text-white"
            >
              Docs
            </Link>
            <Link
              href="/terms"
              className="font-special text-sm text-purple-300 transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="font-special text-sm text-purple-300 transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <a
              href="https://x.com/hhwjsw711"
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
            &copy; {new Date().getFullYear()} Wordream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
