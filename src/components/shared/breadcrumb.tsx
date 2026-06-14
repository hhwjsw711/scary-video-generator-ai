"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  stories: "Stories",
  videos: "Videos",
  generate: "Generate",
  talent: "Talent",
  teams: "Teams",
  settings: "Settings",
  billing: "Billing",
  dashboard: "Dashboard",
  guided: "Guided",
  script: "Script",
  segment: "Segment",
  refine: "Refine",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = LABELS[seg] ?? seg;
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb" className="container py-3">
      <ol className="flex items-center gap-1 font-kecal text-sm text-purple-300">
        <li>
          <Link href="/" className="flex items-center hover:text-white">
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-purple-500" />
            {crumb.isLast ? (
              <span className="text-white">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className={cn("hover:text-white")}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
