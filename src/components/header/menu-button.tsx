"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpenText,
  FilmIcon,
  MenuIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";

export function MenuButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon className="text-purple-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2 bg-gray-900 text-purple-300">
        <DropdownMenuItem asChild>
          <Link
            href="/generate"
            className="flex cursor-pointer items-center gap-2 text-purple-300 hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white"
          >
            <VideoIcon className="h-4 w-4" /> Generate
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/stories"
            className="flex cursor-pointer items-center gap-2 text-purple-300 hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white"
          >
            <BookOpenText className="h-4 w-4" /> Stories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/videos"
            className="flex cursor-pointer items-center gap-2 text-purple-300 hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white"
          >
            <FilmIcon className="h-4 w-4" /> My videos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/talent"
            className="flex cursor-pointer items-center gap-2 text-purple-300 hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white"
          >
            <UserIcon className="h-4 w-4" /> Talent
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/teams"
            className="flex cursor-pointer items-center gap-2 text-purple-300 hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white"
          >
            <UsersIcon className="h-4 w-4" /> Teams
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
