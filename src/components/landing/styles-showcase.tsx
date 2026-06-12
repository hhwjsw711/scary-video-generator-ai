import { cn } from "@/lib/utils";
import {
  Camera,
  Clapperboard,
  Building2,
  Film,
  Heart,
  Skull,
  Mountain,
  Rocket,
  Sparkles,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StyleItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

const STYLES: StyleItem[] = [
  {
    id: "product-ad",
    name: "Product Ad",
    description: "Fresh, tactile product content",
    icon: Camera,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Luxury property cinematography",
    icon: Building2,
  },
  {
    id: "animatic",
    name: "Animatic",
    description: "Storyboard pre-visualization",
    icon: Clapperboard,
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Clean professional visuals",
    icon: Building2,
  },
  {
    id: "award-season",
    name: "Award Season",
    description: "Deep emotional storytelling",
    icon: Heart,
  },
  {
    id: "documentary",
    name: "Documentary",
    description: "Natural observational style",
    icon: Film,
  },
  {
    id: "action",
    name: "Action",
    description: "High-energy dynamic visuals",
    icon: Skull,
  },
  {
    id: "rom-com",
    name: "Rom-Com",
    description: "Warm bright cheerful style",
    icon: Heart,
  },
  {
    id: "animated",
    name: "Animated",
    description: "Premium stylized animation",
    icon: Sparkles,
  },
  {
    id: "neo-noir",
    name: "Neo-Noir",
    description: "Dark stylized thriller",
    icon: Skull,
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Whimsical symmetrical pastels",
    icon: Palette,
  },
  {
    id: "sci-fi",
    name: "Sci-Fi Futuristic",
    description: "High-tech sleek designs",
    icon: Rocket,
  },
  {
    id: "horror-gothic",
    name: "Horror Gothic",
    description: "Dark atmospheric horror",
    icon: Skull,
  },
  {
    id: "western",
    name: "Western Epic",
    description: "Wide vistas golden hour",
    icon: Mountain,
  },
  {
    id: "lo-fi-retro",
    name: "Lo-Fi Retro",
    description: "Vintage smartphone aesthetic",
    icon: Camera,
  },
];

export function StylesShowcase() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-nosifer text-2xl text-purple-300 md:text-[50px] md:leading-[50px]">
          15 Visual Styles
        </h2>
        <p className="mt-4 font-special text-base text-gray-400 md:text-lg">
          Choose from 15 distinct visual styles to match your creative vision.
          Each style tailors the AI&apos;s output to a specific cinematic
          aesthetic.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {STYLES.map((style) => (
          <div
            key={style.id}
            className={cn(
              "group flex flex-col items-center rounded-lg border border-purple-700/30 p-4",
              "bg-purple-900/10 transition-all duration-300",
              "hover:border-purple-500/50 hover:bg-purple-900/30",
              "hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/20",
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/40 text-purple-300 transition-colors group-hover:bg-purple-700 group-hover:text-white">
              <style.icon className="h-5 w-5" />
            </div>
            <span className="mt-3 text-center font-special text-sm font-bold text-purple-300 group-hover:text-white">
              {style.name}
            </span>
            <span className="mt-1 text-center font-special text-xs text-gray-500 group-hover:text-gray-400">
              {style.description}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
