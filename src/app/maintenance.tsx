import Link from "next/link";

export function Maintenance() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 text-center">
      <h1 className="font-nosifer text-3xl text-purple-300 md:text-[50px]">
        Under Maintenance
      </h1>
      <p className="mt-6 font-special text-lg leading-relaxed text-gray-300">
        We&apos;re making some improvements. We&apos;ll be back soon.
      </p>
      <p className="mt-2 font-special text-sm text-purple-400">
        Expected completion: TBD
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-primary px-6 py-3 font-special text-white transition-colors hover:bg-primary/90"
      >
        Check Again
      </Link>
    </div>
  );
}
