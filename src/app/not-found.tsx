import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6">
      <h1 className="font-nosifer text-5xl text-purple-300 md:text-[80px]">
        404
      </h1>
      <h2 className="mt-4 font-amatic text-3xl text-purple-400 md:text-5xl">
        Page Not Found
      </h2>
      <p className="mt-4 font-special text-lg text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-primary px-6 py-3 font-special text-white transition-colors hover:bg-primary/90"
      >
        Back to Home
      </Link>
    </div>
  );
}
